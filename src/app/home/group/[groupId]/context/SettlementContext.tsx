"use client";
import {
  demoSettlements,
  demoSettlementTotal,
} from "@/app/demo/data/SettlementContextData";
import { useGroup } from "@/app/home/context/GroupContext";
import { DetailedSettlement } from "@/types";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

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
    if (!groupId && !isDemoMode) return;
    fetchSettlements();
  }, [groupId, fetchSettlements, isDemoMode]);

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
