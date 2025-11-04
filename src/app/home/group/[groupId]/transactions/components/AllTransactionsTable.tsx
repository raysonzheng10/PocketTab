"use client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import InfiniteScroll from "@/components/ui/infinitescroll";
import { DetailedTransaction } from "@/types";
import { formatAmount, formatDate } from "@/app/utils/utils";
import TransactionSheet from "./TransactionSheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AllTransactionsTable() {
  const {
    transactions,
    hasMoreTransactions,
    transactionsLoading,
    fetchNextTransactions,
  } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedTransaction | null>(null);

  return (
    <>
      <div className="border rounded-lg overflow-auto max-h-[calc(100vh-250px)]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Paid By</TableHead>
              <TableHead className="font-bold text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && !transactionsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedTransaction(t)}
                >
                  <TableCell className="whitespace-nowrap">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.groupMemberNickname}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatAmount(t.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

      <TransactionSheet
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />
    </>
  );
}
