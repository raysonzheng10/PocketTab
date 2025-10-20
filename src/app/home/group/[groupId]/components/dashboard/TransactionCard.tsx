"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TransactionCard() {
  const { group, transactions, transactionsLoading } = useGroup();
  const router = useRouter();
  const [navigateLoading, setNavigateLoading] = useState<boolean>(false);

  const handleNavigateTransactions = () => {
    if (!group) return;
    setNavigateLoading(true);
    router.push(`/home/group/${group.id}/settlements`);
  };

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [transactions]);

  if (transactionsLoading)
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex items-center justify-between pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center justify-between pb-3">
        <CardTitle className="text-xl font-semibold">
          Recent Transactions
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNavigateTransactions}
        >
          {navigateLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          See All Transactions
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet</p>
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
                  {new Date(transaction.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
