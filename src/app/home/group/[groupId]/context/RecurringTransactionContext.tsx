"use client";
import { demoGroupMembers } from "@/app/demo/data/GroupContextData";
import { demoRecurringTransactions } from "@/app/demo/data/RecurringTransactionContextData";
import { useGroup } from "@/app/home/context/GroupContext";
import {
  DetailedRecurringTransaction,
  CreateTransactionExpense,
  ExpenseSplit,
} from "@/types";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

// ! Able to do pagination but for now disabling it
// ! Groups should realistically have some limit of ~10 recurringTransactions
// ! Pagination is excessive and unhelpful at that scale
type RecurringTransactionContextType = {
  recurringTransactions: DetailedRecurringTransaction[];
  recurringTransactionsLoading: boolean;
  resetRecurringTransactions: () => Promise<void>;
  // fetchNextRecurringTransactions: () => Promise<void>;
  // hasMoreRecurringTransactions: boolean;
  createRecurringTransaction: (params: {
    transactionOwnerId: string;
    title: string;
    amount: number;
    interval: string;
    startDate: Date;
    endDate?: Date;
    splits: ExpenseSplit[];
  }) => Promise<boolean>;
  createRecurringTransactionLoading: boolean;
  deleteRecurringTransaction: (params: {
    recurringTransactionId: string;
  }) => Promise<boolean>;
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
  const pathname = usePathname();
  const isDemoMode = pathname?.startsWith("/demo");
  const { groupId } = useGroup();

  const [recurringTransactions, setRecurringTransactions] = useState<
    DetailedRecurringTransaction[]
  >([]);
  const [recurringTransactionsLoading, setRecurringTransactionsLoading] =
    useState<boolean>(true);
  // const [recurringTransactionCursor, setRecurringTransactionCursor] =
  //   useState<string>("");
  // const [hasMoreRecurringTransactions, setHasMoreRecurringTransactions] =
  //   useState<boolean>(true);
  const [
    isCreateRecurringTransactionLoading,
    setIsCreateRecurringTransactionLoading,
  ] = useState<boolean>(false);
  const [error, setError] = useState("");

  const fetchRecurringTransactions = useCallback(
    async (cursor: string) => {
      if (isDemoMode) {
        setRecurringTransactionsLoading(true);
        setRecurringTransactions(demoRecurringTransactions);
        setRecurringTransactionsLoading(false);
        return;
      }

      setRecurringTransactionsLoading(true);
      const cursorAttachment = cursor ? `&cursor=${cursor}` : "";

      try {
        const res = await fetch(
          `/api/protected/recurringTransaction/paginated/${groupId}?limit=20${cursorAttachment}`,
          {
            method: "GET",
          },
        );
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(
            data.error || "Failed to fetch recurring transactions",
          );

        setRecurringTransactions(data.recurringTransactions);

        // if (!cursor) {
        //   setRecurringTransactions(data.recurringTransactions);
        // } else {
        //   setRecurringTransactions((prev) => [
        //     ...prev,
        //     ...data.recurringTransactions,
        //   ]);
        // }

        // setRecurringTransactionCursor(data.cursor);
        // if (!data.cursor) {
        //   setHasMoreRecurringTransactions(false);
        // }

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
    [groupId, isDemoMode],
  );

  useEffect(() => {
    if (!groupId && !isDemoMode) return;
    fetchRecurringTransactions("");

    // fetchRecurringTransactions(recurringTransactionCursor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const resetRecurringTransactions = useCallback(async () => {
    if (recurringTransactionsLoading) {
      return;
    }

    // setRecurringTransactionCursor("");
    await fetchRecurringTransactions("");
  }, [fetchRecurringTransactions, recurringTransactionsLoading]);

  // const fetchNextRecurringTransactions = useCallback(async () => {
  //   if (recurringTransactionsLoading || !hasMoreRecurringTransactions) {
  //     return;
  //   }

  //   await fetchRecurringTransactions(recurringTransactionCursor);
  // }, [
  //   fetchRecurringTransactions,
  //   recurringTransactionsLoading,
  //   hasMoreRecurringTransactions,
  //   recurringTransactionCursor,
  // ]);

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
      splits: ExpenseSplit[];
    }) => {
      if (isDemoMode) {
        setIsCreateRecurringTransactionLoading(true);

        const owner = demoGroupMembers.find((m) => m.id === transactionOwnerId);

        const newTx: DetailedRecurringTransaction = {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          title,
          amount,
          interval: interval as "daily" | "weekly" | "monthly",
          startDate,
          endDate: endDate ?? null,
          nextOccurence: startDate,
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

        setRecurringTransactions((prev) => [...prev, newTx]);
        setIsCreateRecurringTransactionLoading(false);
        return true;
      }
      setIsCreateRecurringTransactionLoading(true);
      try {
        const transformedSplits: CreateTransactionExpense[] = splits.map(
          (split) => ({
            groupMemberId: split.groupMemberId,
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
    [resetRecurringTransactions, isDemoMode],
  );

  const deleteRecurringTransaction = useCallback(
    async ({ recurringTransactionId }: { recurringTransactionId: string }) => {
      try {
        const res = await fetch(`/api/protected/recurringTransaction/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recurringTransactionId,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(
            data.error || "Failed to delete recurring transaction",
          );

        await resetRecurringTransactions();
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error deleting recurring transaction",
        );
        return false;
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
        // fetchNextRecurringTransactions,
        // hasMoreRecurringTransactions,
        createRecurringTransaction,
        createRecurringTransactionLoading: isCreateRecurringTransactionLoading,
        deleteRecurringTransaction,
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
