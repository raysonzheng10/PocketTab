"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface DashboardCardProps {
  openCreateTransactionModal: (open: boolean) => void;
}
export default function DashboardCard({
  openCreateTransactionModal,
}: DashboardCardProps) {
  const {
    group,
    settlements,
    settlementsLoading,
    transactions,
    transactionsLoading,
  } = useGroup();
  const router = useRouter();
  const [navigateLoading, setNavigateLoading] = useState<boolean>(false);

  const handleNavigateSettlements = () => {
    if (!group) return;
    setNavigateLoading(true);
    router.push(`/home/group/${group.id}/settlements`);
  };

  const unsettled = useMemo(() => {
    if (!settlements) return [];
    return Object.entries(settlements.settlements).filter(
      ([, { amount }]) => amount !== 0,
    );
  }, [settlements]);

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [transactions]);

  // skeleton loaders
  if (settlementsLoading || transactionsLoading)
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row-reverse">
            <Skeleton className="h-16 w-40" />
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );

  const total = settlements?.total ?? 0;
  const isSettled = total === 0;
  const positive = total > 0;
  const formattedTotal = Math.abs(total).toFixed(2);

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4">
        {/* Settlement information */}
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-xl font-semibold">
            {isSettled
              ? "You're all settled up!"
              : positive
                ? "Others owe you"
                : "You currently owe"}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateSettlements}
          >
            {navigateLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            See All Settlements
          </Button>
        </div>
        <div
          className={`flex flex-row-reverse items-center text-5xl font-bold tracking-tight mt-2 ${
            isSettled
              ? "text-gray-500"
              : positive
                ? "text-green-600"
                : "text-red-600"
          }`}
        >
          <p>{isSettled ? "$0.00" : `$${formattedTotal}`}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {unsettled.length > 0
              ? `You have ${unsettled.length} unsettled debt${
                  unsettled.length > 1 ? "s" : ""
                }`
              : "No unsettled debts"}
          </div>
        </div>

        <Separator />

        {/* Recent Transactions */}
        <div>
          <div className="flex flex-row justify-between items-center py-3 mb-4">
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <Button
              variant="outline"
              onClick={() => {
                openCreateTransactionModal(true);
              }}
            >
              Create Transaction
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No transactions yet
              </p>
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
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
