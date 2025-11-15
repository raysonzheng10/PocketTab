"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import {
  DetailedTransaction,
  CreateTransactionExpense,
  ExpenseSplit,
} from "@/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { demoTransactions } from "@/app/demo/data/TransactionContextData";
import { demoGroupMembers } from "@/app/demo/data/GroupContextData";
import { simulateDelay } from "@/app/utils/utils";

type TransactionContextType = {
  transactions: DetailedTransaction[];
  transactionsLoading: boolean;
  resetTransactions: () => Promise<void>;
  isResettingTransactions: boolean;
  fetchNextTransactions: () => Promise<void>;
  hasMoreTransactions: boolean;
  createTransaction: (params: {
    transactionOwnerId: string;
    title: string;
    amount: number;
    date: Date;
    splits: ExpenseSplit[];
  }) => Promise<boolean>;
  createTransactionLoading: boolean;
  createReimbursement: (params: {
    reimbursementCreatorId: string;
    recipientId: string;
    title: string;
    amount: number;
    date: Date;
  }) => Promise<boolean>;
  createReimbursementLoading: boolean;
  deleteTransaction: (params: { transactionId: string }) => Promise<boolean>;
  error: string;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDemoMode = pathname?.startsWith("/demo");

  const { groupId } = useGroup();

  const [transactions, setTransactions] = useState<DetailedTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [transactionCursor, setTransactionCursor] = useState<string>("");
  const [hasMoreTransactions, setHasMoreTransactions] = useState<boolean>(true);
  const [isCreateTransactionLoading, setIsCreateTransactionLoading] =
    useState<boolean>(false);
  const [isCreateReimbursementLoading, setIsCreateReimbursementLoading] =
    useState<boolean>(false);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(
    async (cursor: string) => {
      if (isDemoMode) {
        setTransactionsLoading(true);
        await simulateDelay(400);
        setTransactions(demoTransactions);
        setHasMoreTransactions(false);
        setError("");
        setTransactionsLoading(false);
        return;
      }

      setTransactionsLoading(true);
      console.log("refreshing transactions");
      const cursorAttachment = cursor ? `&cursor=${cursor}` : "";

      try {
        const res = await fetch(
          `/api/protected/transaction/paginated/${groupId}?limit=5${cursorAttachment}`,
          { method: "GET" },
        );

        const data = await res.json();
        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to fetch transactions");

        if (!cursor) {
          setTransactions(data.transactions);
        } else {
          setTransactions((prev) => [...prev, ...data.transactions]);
        }

        setTransactionCursor(data.cursor);
        if (!data.cursor) setHasMoreTransactions(false);

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
    },
    [groupId, isDemoMode],
  );

  useEffect(() => {
    if (!groupId && !isDemoMode) return;
    fetchTransactions(transactionCursor);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const [isResettingTransactions, setIsResettingTransactions] =
    useState<boolean>(true);

  const resetTransactions = useCallback(async () => {
    if (transactionsLoading) {
      return;
    }
    setIsResettingTransactions(true);
    setTransactionCursor("");
    await fetchTransactions("");
    setIsResettingTransactions(false);
  }, [fetchTransactions, transactionsLoading]);

  const fetchNextTransactions = useCallback(async () => {
    if (transactionsLoading || !hasMoreTransactions) {
      return;
    }

    await fetchTransactions(transactionCursor);
  }, [
    fetchTransactions,
    transactionsLoading,
    hasMoreTransactions,
    transactionCursor,
  ]);

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
      splits: ExpenseSplit[];
    }) => {
      if (isDemoMode) {
        setIsCreateTransactionLoading(true);
        await simulateDelay(250);
        const owner = demoGroupMembers.find((m) => m.id === transactionOwnerId);

        const newTx: DetailedTransaction = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          amount,
          title,
          date,
          isReimbursement: false,
          groupMemberId: owner?.id ?? transactionOwnerId,
          groupMemberNickname: owner?.nickname ?? "",
          detailedExpenses: splits.map((s) => ({
            groupMemberId: s.groupMemberId,
            groupMemberNickname:
              demoGroupMembers.find((m) => m.id === s.groupMemberId)
                ?.nickname ?? "",
            amount: s.amount,
          })),
        };

        setTransactions((prev) => [newTx, ...prev]);
        setIsCreateTransactionLoading(false);
        return true;
      }

      setIsCreateTransactionLoading(true);
      try {
        const transformedSplits: CreateTransactionExpense[] = splits.map(
          (split) => ({
            groupMemberId: split.groupMemberId,
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

        resetTransactions();
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
    [resetTransactions, isDemoMode],
  );

  const deleteTransaction = useCallback(
    async ({ transactionId }: { transactionId: string }) => {
      if (isDemoMode) {
        await simulateDelay(250);
        setTransactions((prev) => {
          const next = prev.filter((tx) => tx.id !== transactionId);
          return next;
        });
        return true;
      }

      try {
        const res = await fetch(`/api/protected/transaction/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to delete transaction");

        await resetTransactions();
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error deleting transaction",
        );
        return false;
      }
    },
    [resetTransactions, isDemoMode],
  );

  const createReimbursement = useCallback(
    async ({
      reimbursementCreatorId,
      recipientId,
      title,
      amount,
      date,
    }: {
      reimbursementCreatorId: string;
      recipientId: string;
      title: string;
      amount: number;
      date: Date;
    }) => {
      if (isDemoMode) {
        setIsCreateReimbursementLoading(true);
        await simulateDelay(250);
        const payer = demoGroupMembers.find(
          (m) => m.id === reimbursementCreatorId,
        );
        const recipient = demoGroupMembers.find((m) => m.id === recipientId);

        const newTx: DetailedTransaction = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          amount,
          title,
          date,
          isReimbursement: true,
          groupMemberId: payer?.id ?? reimbursementCreatorId,
          groupMemberNickname: payer?.nickname ?? "",
          detailedExpenses: [
            {
              groupMemberId: recipient?.id ?? recipientId,
              groupMemberNickname: recipient?.nickname ?? "",
              amount,
            },
          ],
        };

        setTransactions((prev) => [newTx, ...prev]);
        setIsCreateReimbursementLoading(false);
        return true;
      }

      setIsCreateReimbursementLoading(true);
      try {
        const res = await fetch(
          `/api/protected/transaction/reimbursement/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reimbursementCreatorId,
              recipientId,
              title,
              amount,
              date,
            }),
          },
        );
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to create transaction");

        resetTransactions();
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
        setIsCreateReimbursementLoading(false);
      }
    },
    [resetTransactions, isDemoMode],
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        transactionsLoading,
        resetTransactions,
        isResettingTransactions,
        fetchNextTransactions,
        hasMoreTransactions,
        createTransaction,
        createTransactionLoading: isCreateTransactionLoading,
        createReimbursement,
        createReimbursementLoading: isCreateReimbursementLoading,
        deleteTransaction,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context)
    throw new Error("useTransactions must be used within TransactionProvider");
  return context;
}
