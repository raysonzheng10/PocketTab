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

export default function RecurringTransactionsTable() {
  const { recurringTransactions } = useRecurringTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedRecurringTransaction | null>(null);

  return (
    <>
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
            {recurringTransactions.map((t) => (
              <TableRow
                key={t.id}
                className="cursor-pointer"
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
            ))}
          </TableBody>
        </Table>
      </div>

      <RecurringTransactionSheet
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />
    </>
  );
}
