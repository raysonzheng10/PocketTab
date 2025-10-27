"use client";
import {
  DetailedSettlements,
  DetailedTransaction,
  Expense,
  Group,
  GroupMember,
} from "@/types";
import { ExpenseSplit } from "@/types/expense";
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
  createTransaction: (params: {
    transactionOwnerId: string;
    title: string;
    amount: number;
    date: Date;
    splits: Record<string, ExpenseSplit>;
  }) => Promise<boolean>;
  createTransactionLoading: boolean;
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

  const [isCreateTransactionLoading, setIsCreateTransactionLoading] =
    useState<boolean>(false);

  const createTransaction = useCallback(
    async ({
      transactionOwnerId,
      title,
      amount,
      date,
      splits,
    }: {
      transactionOwnerId: string;
      title: string;
      amount: number;
      date: Date;
      splits: Record<string, ExpenseSplit>;
    }) => {
      setIsCreateTransactionLoading(true);
      try {
        const transformedSplits: Expense[] = Object.entries(splits).map(
          ([id, split]) => ({
            groupMemberId: id,
            amount: split.amount,
          }),
        );

        const res = await fetch(`/api/protected/transaction/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionOwnerId,
            title,
            amount,
            date,
            splits: transformedSplits,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to create transaction");

        // refetch transactions after creating
        fetchTransactions();
        fetchSettlements();
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error creating transaction",
        );
        return false;
      } finally {
        setIsCreateTransactionLoading(false);
      }
    },
    [fetchTransactions],
  );

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
        createTransaction,
        createTransactionLoading: isCreateTransactionLoading,
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
