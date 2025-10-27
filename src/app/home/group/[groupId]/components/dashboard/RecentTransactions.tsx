// components/RecentTransactions.tsx
"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface RecentTransactionsProps {
  onCreateTransaction: () => void;
}

export default function RecentTransactions({
  onCreateTransaction,
}: RecentTransactionsProps) {
  const router = useRouter();
  const { group, transactions } = useGroup();

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [transactions]);

  const handleNavigateTransactions = () => {
    if (!group) return;
    router.push(`/home/group/${group.id}/transactions`);
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center py-3 mb-4">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        <Button variant="outline" onClick={onCreateTransaction}>
          Create Transaction
        </Button>
      </div>

      <div className="space-y-3">
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No Transactions yet</p>
        ) : (
          recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{transaction.title}</h4>
                <span
                  className={`text-lg font-bold ${
                    transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Paid by {transaction.groupMemberNickname}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {recentTransactions.length > 0 && (
        <Button
          variant="ghost"
          className="w-full mt-3"
          onClick={handleNavigateTransactions}
        >
          See All Transactions
        </Button>
      )}
    </div>
  );
}
