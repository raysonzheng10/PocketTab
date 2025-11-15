// components/RecentTransactions.tsx
"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useTransactions } from "../../../context/TransactionContext";
import TransactionSheet from "../../../transactions/components/TransactionSheet";
import { DetailedTransaction } from "@/types";
import { formatDate } from "@/app/utils/utils";

export default function RecentTransactions() {
  const pathname = usePathname();
  const router = useRouter();
  const { group } = useGroup();
  const { transactions } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<DetailedTransaction | null>(null);

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.slice(0, 3);
  }, [transactions]);

  const isDemoPage = pathname.startsWith("/demo");
  const handleNavigateTransactions = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push(`/demo/transactions`);
    } else {
      router.push(`/home/group/${group.id}/transactions`);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center py-3 mb-4">
        <h3 className="text-lg sm:text-xl font-semibold truncate">
          Recent Transactions
        </h3>
        {recentTransactions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateTransactions}
          >
            All Transactions
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No Transactions yet</p>
        ) : (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-base leading-tight">
                    {transaction.title}
                  </h4>
                  <span className="text-lg text-primary font-bold tabular-nums shrink-0">
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="truncate">
                    {transaction.groupMemberNickname}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="tabular-nums">
                    {formatDate(transaction.date)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <TransactionSheet
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
      />
    </div>
  );
}
