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
import { useSettlements } from "./SettlementContext";

type TransactionContextType = {
  transactions: DetailedTransaction[];
  transactionsLoading: boolean;
  resetTransactions: () => Promise<void>;
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
    payerId: string;
    recipientId: string;
    title: string;
    amount: number;
    date: Date;
  }) => Promise<boolean>;
  createReimbursementLoading: boolean;
  error: string;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { groupId } = useGroup();
  const { refreshSettlements } = useSettlements();

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
      setTransactionsLoading(true);
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
    [groupId],
  );

  useEffect(() => {
    if (!groupId) return;
    fetchTransactions(transactionCursor);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const resetTransactions = useCallback(async () => {
    if (transactionsLoading) {
      return;
    }

    setTransactionCursor("");
    await fetchTransactions("");
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
        refreshSettlements();
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
    [resetTransactions, refreshSettlements],
  );

  const createReimbursement = useCallback(
    async ({
      payerId,
      recipientId,
      title,
      amount,
      date,
    }: {
      payerId: string;
      recipientId: string;
      title: string;
      amount: number;
      date: Date;
    }) => {
      setIsCreateReimbursementLoading(true);
      try {
        const res = await fetch(
          `/api/protected/transaction/reimbursement/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              payerId,
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
        refreshSettlements();
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
    [resetTransactions, refreshSettlements],
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        transactionsLoading,
        resetTransactions,
        fetchNextTransactions,
        hasMoreTransactions,
        createTransaction,
        createTransactionLoading: isCreateTransactionLoading,
        createReimbursement,
        createReimbursementLoading: isCreateReimbursementLoading,
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
