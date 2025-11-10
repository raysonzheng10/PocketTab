"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRecurringTransactions } from "../../context/RecurringTransactionContext";
import { formatAmount, formatDate } from "@/app/utils/utils";
import { DetailedRecurringTransaction } from "@/types";
import { useState } from "react";
import RecurringTransactionSheet from "./RecurringTransactionSheet";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RecurringTransactionsTable() {
  const { recurringTransactions, recurringTransactionsLoading } =
    useRecurringTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedRecurringTransaction | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="info">
        <AlertDescription className="text-center">
          Only recurring transactions that are still active will be displayed.
        </AlertDescription>
      </Alert>

      <div className="border rounded-lg overflow-auto max-h-[calc(100vh-250px)]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="font-bold">Next Occurrence</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Interval</TableHead>
              <TableHead className="font-bold">Paid By</TableHead>
              <TableHead className="font-bold text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recurringTransactions.length === 0 &&
            !recurringTransactionsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-muted-foreground"
                >
                  No recurring transactions found
                </TableCell>
              </TableRow>
            ) : (
              recurringTransactions.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => setSelectedTransaction(t)}
                >
                  <TableCell className="whitespace-nowrap">
                    {formatDate(t.nextOccurence)}
                  </TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell className="capitalize">{t.interval}</TableCell>
                  <TableCell>{t.groupMemberNickname}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatAmount(t.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {recurringTransactionsLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
      </div>

      <RecurringTransactionSheet
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />
    </div>
  );
}
