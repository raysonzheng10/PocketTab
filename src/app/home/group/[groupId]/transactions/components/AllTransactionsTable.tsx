"use client";
import { Loader2, ArrowLeftRight } from "lucide-react";
import { useState, useMemo } from "react";
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
import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AllTransactionsTable() {
  const { userGroupMemberId } = useGroup();
  const {
    transactions,
    hasMoreTransactions,
    transactionsLoading,
    fetchNextTransactions,
  } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedTransaction | null>(null);

  const [filterMyTransactions, setFilterMyTransactions] =
    useState<boolean>(true);
  const filteredTransactions = useMemo<DetailedTransaction[]>(() => {
    if (!filterMyTransactions) return transactions;

    return transactions.filter((t) => {
      // Check if user is the payer
      if (t.groupMemberId === userGroupMemberId) return true;

      // Check if user is involved in any expenses
      return t.detailedExpenses.some(
        (expense) => expense.groupMemberId === userGroupMemberId,
      );
    });
  }, [transactions, filterMyTransactions, userGroupMemberId]);

  return (
    <>
      <div className="mb-4">
        <Alert variant="info">
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-center">
              {filterMyTransactions
                ? "Showing only transactions involving you"
                : "Showing all group transactions"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterMyTransactions(!filterMyTransactions)}
              className="gap-2 w-full sm:w-auto"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {filterMyTransactions ? "View All" : "View Mine"}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
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
            {filteredTransactions.length === 0 && !transactionsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedTransaction(t)}
                >
                  <TableCell className="whitespace-nowrap">
                    {formatDate(t.date)}
                  </TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>
                    {t.groupMemberNickname}{" "}
                    {t.groupMemberId === userGroupMemberId && " (You)"}
                  </TableCell>
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
