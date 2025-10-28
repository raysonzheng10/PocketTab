"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { DetailedRecurringTransaction, Expense, ExpenseSplit } from "@/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

type RecurringTransactionContextType = {
  recurringTransactions: DetailedRecurringTransaction[];
  recurringTransactionsLoading: boolean;
  resetRecurringTransactions: () => Promise<void>;
  fetchNextRecurringTransactions: () => Promise<void>;
  hasMoreRecurringTransactions: boolean;
  createRecurringTransaction: (params: {
    transactionOwnerId: string;
    title: string;
    amount: number;
    interval: string;
    startDate: Date;
    splits: Record<string, ExpenseSplit>;
  }) => Promise<boolean>;
  createRecurringTransactionLoading: boolean;
  error: string;
};

const RecurringTransactionContext = createContext<
  RecurringTransactionContextType | undefined
>(undefined);

export function RecurringTransactionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { groupId } = useGroup();

  const [recurringTransactions, setRecurringTransactions] = useState<
    DetailedRecurringTransaction[]
  >([]);
  const [recurringTransactionsLoading, setRecurringTransactionsLoading] =
    useState<boolean>(true);
  const [recurringTransactionCursor, setRecurringTransactionCursor] =
    useState<string>("");
  const [hasMoreRecurringTransactions, setHasMoreRecurringTransactions] =
    useState<boolean>(true);
  const [
    isCreateRecurringTransactionLoading,
    setIsCreateRecurringTransactionLoading,
  ] = useState<boolean>(false);
  const [error, setError] = useState("");

  const cursorAttachment = recurringTransactionCursor
    ? `&cursor=${recurringTransactionCursor}`
    : "";

  const fetchRecurringTransactions = useCallback(async () => {
    setRecurringTransactionsLoading(true);
    try {
      const res = await fetch(
        `/api/protected/recurring-transaction/paginated/${groupId}?limit=5${cursorAttachment}`,
        {
          method: "GET",
        },
      );
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch recurring transactions");

      setRecurringTransactions(data.recurringTransactions);
      setRecurringTransactionCursor(data.cursor);
      if (!data.cursor) {
        setHasMoreRecurringTransactions(false);
      }

      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error fetching recurring transactions",
      );
      setRecurringTransactions([]);
    } finally {
      setRecurringTransactionsLoading(false);
    }
  }, [groupId, cursorAttachment]);

  useEffect(() => {
    if (!groupId) return;
    fetchRecurringTransactions();
  }, [groupId, fetchRecurringTransactions]);

  const resetRecurringTransactions = useCallback(async () => {
    if (recurringTransactionsLoading) {
      return;
    }

    setRecurringTransactionCursor("");
    await fetchRecurringTransactions();
  }, [fetchRecurringTransactions, recurringTransactionsLoading]);

  const fetchNextRecurringTransactions = useCallback(async () => {
    if (recurringTransactionsLoading || !hasMoreRecurringTransactions) {
      return;
    }

    await fetchRecurringTransactions();
  }, [
    fetchRecurringTransactions,
    recurringTransactionsLoading,
    hasMoreRecurringTransactions,
  ]);

  const createRecurringTransaction = useCallback(
    async ({
      transactionOwnerId,
      title,
      amount,
      interval,
      startDate,
      splits,
    }: {
      transactionOwnerId: string;
      title: string;
      amount: number;
      interval: string;
      startDate: Date;
      splits: Record<string, ExpenseSplit>;
    }) => {
      setIsCreateRecurringTransactionLoading(true);
      try {
        const transformedSplits: Expense[] = Object.entries(splits).map(
          ([id, split]) => ({
            groupMemberId: id,
            amount: split.amount,
          }),
        );

        const res = await fetch(`/api/protected/recurring-transaction/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionOwnerId,
            title,
            amount,
            interval,
            startDate,
            splits: transformedSplits,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(
            data.error || "Failed to create recurring transaction",
          );

        resetRecurringTransactions();
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error creating recurring transaction",
        );
        return false;
      } finally {
        setIsCreateRecurringTransactionLoading(false);
      }
    },
    [resetRecurringTransactions],
  );

  return (
    <RecurringTransactionContext.Provider
      value={{
        recurringTransactions,
        recurringTransactionsLoading,
        resetRecurringTransactions,
        fetchNextRecurringTransactions,
        hasMoreRecurringTransactions,
        createRecurringTransaction,
        createRecurringTransactionLoading: isCreateRecurringTransactionLoading,
        error,
      }}
    >
      {children}
    </RecurringTransactionContext.Provider>
  );
}

export function useRecurringTransactions() {
  const context = useContext(RecurringTransactionContext);
  if (!context)
    throw new Error(
      "useRecurringTransactions must be used within RecurringTransactionProvider",
    );
  return context;
}
