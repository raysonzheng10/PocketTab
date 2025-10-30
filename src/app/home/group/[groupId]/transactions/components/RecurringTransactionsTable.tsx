"use client";
import { Loader2 } from "lucide-react";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { useRecurringTransactions } from "../../context/RecurringTransactionContext";

export default function RecurringTransactionsTable() {
  const {
    recurringTransactions,
    recurringTransactionsLoading,
    hasMoreRecurringTransactions,
    fetchNextRecurringTransactions,
  } = useRecurringTransactions();

  return (
    <div className="border rounded-lg overflow-auto max-h-[calc(100vh-300px)]">
      <table className="min-w-fit w-full border-collapse">
        <thead className="sticky top-0 bg-white border-b z-10">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Next Occurence
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Interval
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {recurringTransactions.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="px-4 py-3 text-sm">{t.title}</td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {new Date(t.nextOccurence).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {t.interval}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                ${t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <InfiniteScroll
        hasMore={hasMoreRecurringTransactions}
        isLoading={recurringTransactionsLoading}
        next={fetchNextRecurringTransactions}
        threshold={0.5}
      >
        {hasMoreRecurringTransactions && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
