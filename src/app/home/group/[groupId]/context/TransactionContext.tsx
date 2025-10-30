"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { DetailedTransaction, Expense, ExpenseSplit } from "@/types";
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
    splits: Record<string, ExpenseSplit>;
  }) => Promise<boolean>;
  createTransactionLoading: boolean;
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
  const [error, setError] = useState("");

  const cursorAttachment = transactionCursor
    ? `&cursor=${transactionCursor}`
    : "";

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const res = await fetch(
        `/api/protected/transaction/paginated/${groupId}?limit=5${cursorAttachment}`,
        {
          method: "GET",
        },
      );
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch transactions");

      console.log(data.transactions);
      if (!transactionCursor) {
        setTransactions(data.transactions);
      } else {
        setTransactions((prev) => [...prev, ...data.transactions]);
      }
      setTransactionCursor(data.cursor);
      if (!data.cursor) {
        setHasMoreTransactions(false);
      }

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
  }, [groupId, cursorAttachment]);

  useEffect(() => {
    if (!groupId) return;
    fetchTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const resetTransactions = useCallback(async () => {
    if (transactionsLoading) {
      return;
    }

    setTransactionCursor("");
    await fetchTransactions();
  }, [fetchTransactions, transactionsLoading]);

  const fetchNextTransactions = useCallback(async () => {
    if (transactionsLoading || !hasMoreTransactions) {
      return;
    }

    await fetchTransactions();
  }, [fetchTransactions, transactionsLoading, hasMoreTransactions]);

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
