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
    endDate?: Date;
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

  const fetchRecurringTransactions = useCallback(
    async (cursor: string) => {
      setRecurringTransactionsLoading(true);
      const cursorAttachment = cursor ? `&cursor=${cursor}` : "";

      try {
        const res = await fetch(
          `/api/protected/recurringTransaction/paginated/${groupId}?limit=5${cursorAttachment}`,
          {
            method: "GET",
          },
        );
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(
            data.error || "Failed to fetch recurring transactions",
          );

        if (!cursor) {
          setRecurringTransactions(data.recurringTransactions);
        } else {
          setRecurringTransactions((prev) => [
            ...prev,
            ...data.recurringTransactions,
          ]);
        }
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
    },
    [groupId],
  );

  useEffect(() => {
    if (!groupId) return;
    fetchRecurringTransactions(recurringTransactionCursor);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const resetRecurringTransactions = useCallback(async () => {
    if (recurringTransactionsLoading) {
      return;
    }

    setRecurringTransactionCursor("");
    await fetchRecurringTransactions("");
  }, [fetchRecurringTransactions, recurringTransactionsLoading]);

  const fetchNextRecurringTransactions = useCallback(async () => {
    if (recurringTransactionsLoading || !hasMoreRecurringTransactions) {
      return;
    }

    await fetchRecurringTransactions(recurringTransactionCursor);
  }, [
    fetchRecurringTransactions,
    recurringTransactionsLoading,
    hasMoreRecurringTransactions,
    recurringTransactionCursor,
  ]);

  const createRecurringTransaction = useCallback(
    async ({
      transactionOwnerId,
      title,
      amount,
      interval,
      startDate,
      endDate,
      splits,
    }: {
      transactionOwnerId: string;
      title: string;
      amount: number;
      interval: string;
      startDate: Date;
      endDate?: Date;
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

        const res = await fetch(`/api/protected/recurringTransaction/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionOwnerId,
            title,
            amount,
            interval,
            startDate,
            splits: transformedSplits,
            ...(endDate && { endDate }),
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
