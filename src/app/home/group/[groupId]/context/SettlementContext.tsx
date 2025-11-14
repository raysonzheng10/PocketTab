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
import { demoUser } from "@/app/demo/data/UserContextData";
import { demoGroupMembers } from "@/app/demo/data/GroupContextData";

// ! ONLY FOR DEMO SUPPORT
function recomputeDemoSettlements(
  transactions: DetailedTransaction[],
): DetailedSettlement[] {
  const ledger: Record<string, number> = {};

  for (const tx of transactions) {
    const payer = tx.groupMemberId;

    for (const e of tx.detailedExpenses) {
      if (e.groupMemberId === payer) continue;

      if (demoUser.id === payer) {
        ledger[e.groupMemberId] = (ledger[e.groupMemberId] ?? 0) + e.amount;
      } else if (demoUser.id === e.groupMemberId) {
        ledger[payer] = (ledger[payer] ?? 0) - e.amount;
      }
    }
  }

  return Object.entries(ledger).map(([id, amount]) => {
    const member = demoGroupMembers.find((m) => m.id === id);
    return {
      groupMemberId: id,
      nickname: member?.nickname ?? "",
      amount,
    };
  });
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
  const { groupId } = useGroup();
  const { transactions, isResettingTransactions } = useTransactions();

  const [settlements, setSettlements] = useState<DetailedSettlement[]>([]);
  const [settlementTotal, setSettlementTotal] = useState<number>(0);
  const [settlementsLoading, setSettlementsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSettlements = useCallback(async () => {
    if (isDemoMode) {
      setSettlementsLoading(true);
      setSettlements(demoSettlements);
      setSettlementTotal(demoSettlementTotal);
      setSettlementsLoading(false);
      return;
    }

    setSettlementsLoading(true);
    try {
      const res = await fetch(`/api/protected/settlement/${groupId}`, {
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
  }, [groupId, isDemoMode]);

  useEffect(() => {
    if (isDemoMode) return;
    if (!groupId) return;
    if (!isResettingTransactions) return;

    fetchSettlements();
  }, [groupId, fetchSettlements, isDemoMode, isResettingTransactions]);

  useEffect(() => {
    if (!isDemoMode) return;
    setSettlementsLoading(true);
    setSettlements(recomputeDemoSettlements(transactions));
    setSettlementsLoading(false);
  }, [isDemoMode, transactions]);

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
