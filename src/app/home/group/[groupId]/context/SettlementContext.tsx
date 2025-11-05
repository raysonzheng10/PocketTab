"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { DetailedSettlement } from "@/types";
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
  settlementTotal: number;
  settlementsLoading: boolean;
  refreshSettlements: () => Promise<void>;
  error: string;
};

const SettlementContext = createContext<SettlementContextType | undefined>(
  undefined,
);

export function SettlementProvider({ children }: { children: ReactNode }) {
  const { groupId } = useGroup();

  const [settlements, setSettlements] = useState<DetailedSettlement[]>([]);
  const [settlementTotal, setSettlementTotal] = useState<number>(0);
  const [settlementsLoading, setSettlementsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSettlements = useCallback(async () => {
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
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    fetchSettlements();
  }, [groupId, fetchSettlements]);

  return (
    <SettlementContext.Provider
      value={{
        settlements,
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
