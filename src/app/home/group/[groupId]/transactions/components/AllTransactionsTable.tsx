"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTransactions } from "../../context/TransactionContext";
import InfiniteScroll from "@/components/ui/infinitescroll";

export default function AllTransactionsTable() {
  const {
    transactions,
    hasMoreTransactions,
    transactionsLoading,
    fetchNextTransactions,
  } = useTransactions();

  return (
    <div className="border rounded-lg overflow-auto max-h-[calc(100vh-300px)]">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white border-b z-10">
          <tr>
            <th className="min-w-[140px] px-4 py-3 text-left text-sm font-medium">
              Date
            </th>
            <th className="min-w-[250px] px-4 py-3 text-left text-sm font-medium">
              Description
            </th>
            <th className="min-w-[150px] px-4 py-3 text-left text-sm font-medium">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                {new Date(t.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm">{t.title}</td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                ${t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <InfiniteScroll
        hasMore={hasMoreTransactions}
        isLoading={transactionsLoading}
        next={fetchNextTransactions}
        threshold={0.5}
      >
        {hasMoreTransactions && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
