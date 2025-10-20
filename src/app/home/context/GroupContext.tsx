"use client";
import {
  DetailedSettlements,
  DetailedTransaction,
  Group,
  GroupMember,
} from "@/types";
import { useParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

type GroupContextType = {
  group: Group | null;
  error: string;
  groupMembers: GroupMember[];
  groupLoading: boolean;
  refreshGroup: () => Promise<void>;
  transactions: DetailedTransaction[];
  transactionsLoading: boolean;
  refreshTransactions: () => Promise<void>;
  settlements: DetailedSettlements | null;
  settlementsLoading: boolean;
  refreshSettlements: () => Promise<void>;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const groupId = params.groupId as string; // must match folder name [group]

  // ----- group data -----
  const [group, setGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [error, setError] = useState("");
  const [groupLoading, setGroupLoading] = useState(true);

  const fetchGroupWithGroupMembers = useCallback(async () => {
    setGroupLoading(true);
    try {
      const res = await fetch(`/api/protected/group/${groupId}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch group data/members");

      setGroup(data.group);
      setGroupMembers(data.groupMembers);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unknown error fetching group",
      );
      setGroup(null);
      setGroupMembers([]);
    } finally {
      setGroupLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    fetchGroupWithGroupMembers();
  }, [groupId, fetchGroupWithGroupMembers]);

  // ----- transactions data -----
  const [transactions, setTransactions] = useState<DetailedTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const res = await fetch(`/api/protected/transaction/${groupId}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch transactions");

      setTransactions(data.transactions);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error fetching transactions",
      );
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    fetchTransactions();
  }, [groupId, fetchTransactions]);

  // ----- settlements data -----
  const [settlements, setSettlements] = useState<DetailedSettlements | null>(
    null,
  );
  const [settlementsLoading, setSettlementsLoading] = useState(true);

  const fetchSettlements = useCallback(async () => {
    setSettlementsLoading(true);
    try {
      const res = await fetch(`/api/protected/settlement/${groupId}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch settlements");

      setSettlements(data);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error fetching settlements",
      );
      setSettlements(null);
    } finally {
      setSettlementsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    fetchSettlements();
  }, [groupId, fetchSettlements]);

  return (
    <GroupContext.Provider
      value={{
        group,
        groupMembers,
        groupLoading,
        error,
        refreshGroup: fetchGroupWithGroupMembers,
        transactions,
        transactionsLoading,
        refreshTransactions: fetchTransactions,
        settlements,
        settlementsLoading,
        refreshSettlements: fetchSettlements,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used within GroupProvider");
  return context;
}
