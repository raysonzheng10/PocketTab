"use client";
import {
  demoSettlements,
  demoSettlementTotal,
} from "@/app/demo/data/SettlementContextData";
import { useGroup } from "@/app/home/context/GroupContext";
import { useTransactions } from "./TransactionContext";
import { DetailedSettlement, DetailedTransaction } from "@/types";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import {
  demoGroupMembers,
  demoUserGroupMember,
} from "@/app/demo/data/GroupContextData";
import { simulateDelay } from "@/app/utils/utils";

// ! ONLY FOR DEMO SUPPORT
function recomputeDemoSettlements(transactions: DetailedTransaction[]): {
  settlements: DetailedSettlement[];
  total: number;
} {
  const ledger: Record<string, number> = {};

  for (const tx of transactions) {
    const payer = tx.groupMemberId;

    for (const e of tx.detailedExpenses) {
      if (e.groupMemberId === payer) continue;

      if (demoUserGroupMember.id === payer) {
        ledger[e.groupMemberId] = (ledger[e.groupMemberId] ?? 0) + e.amount;
      } else if (demoUserGroupMember.id === e.groupMemberId) {
        ledger[payer] = (ledger[payer] ?? 0) - e.amount;
      }
    }
  }

  const settlements = Object.entries(ledger).map(([id, amount]) => {
    const member = demoGroupMembers.find((m) => m.id === id);
    return {
      groupMemberId: id,
      nickname: member?.nickname ?? "",
      amount,
    };
  });

  const total = settlements.reduce((acc, s) => acc + s.amount, 0);

  return { settlements, total };
}

type SettlementContextType = {
  settlements: DetailedSettlement[];
  setSettlements: (settlements: DetailedSettlement[]) => void;
  settlementTotal: number;
  settlementsLoading: boolean;
  refreshSettlements: () => Promise<void>;
  error: string;
};

const SettlementContext = createContext<SettlementContextType | undefined>(
  undefined,
);

export function SettlementProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDemoMode = pathname?.startsWith("/demo");
  const { group } = useGroup();
  const { transactions, isResettingTransactions } = useTransactions();

  const [settlements, setSettlements] = useState<DetailedSettlement[]>([]);
  const [settlementTotal, setSettlementTotal] = useState<number>(0);
  const [settlementsLoading, setSettlementsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSettlements = useCallback(async () => {
    if (isDemoMode) {
      setSettlementsLoading(true);
      await simulateDelay(400);
      setSettlements(demoSettlements);
      setSettlementTotal(demoSettlementTotal);
      setSettlementsLoading(false);
      return;
    }

    if (!group) {
      return;
    }

    setSettlementsLoading(true);
    try {
      const res = await fetch(`/api/protected/settlement/${group.id}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch settlements");

      setSettlements(data.settlements);
      setSettlementTotal(data.total);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error fetching settlements",
      );
      setSettlements([]);
      setSettlementTotal(0);
    } finally {
      setSettlementsLoading(false);
    }
  }, [group, isDemoMode]);

  useEffect(() => {
    if (!group) return;

    fetchSettlements();
  }, [group, fetchSettlements, isResettingTransactions]);

  const demoUpdateSettlements = useCallback(async () => {
    if (!isDemoMode) return;
    setSettlementsLoading(true);
    await simulateDelay(250);

    const { settlements: rcSettlements, total: rcTotal } =
      recomputeDemoSettlements(transactions);
    setSettlements(rcSettlements);
    setSettlementTotal(rcTotal);
    setSettlementsLoading(false);
  }, [isDemoMode, transactions]);

  useEffect(() => {
    if (!isDemoMode) return;

    demoUpdateSettlements();
  }, [isDemoMode, demoUpdateSettlements]);

  return (
    <SettlementContext.Provider
      value={{
        settlements,
        setSettlements,
        settlementTotal,
        settlementsLoading,
        refreshSettlements: fetchSettlements,
        error,
      }}
    >
      {children}
    </SettlementContext.Provider>
  );
}

export function useSettlements() {
  const context = useContext(SettlementContext);
  if (!context)
    throw new Error("useSettlements must be used within SettlementProvider");
  return context;
}
