"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "./context/GroupContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Copy, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function PageContent() {
  const { setError } = useError();
  const {
    group,
    groupMembers,
    groupLoading,
    transactions,
    transactionsLoading,
    settlements,
    settlementsLoading,
    error: groupContextError,
  } = useGroup();

  const [isBalanceDetailsOpen, setIsBalanceDetailsOpen] = useState(false);

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  const params = useParams();
  const groupId = params.groupId as string;

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Compact Group Info Header */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {groupLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {group?.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {group?.description}
                    </CardDescription>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Members - Compact */}
            <div>
              {groupLoading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {groupMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="px-2 py-0.5 text-xs"
                    >
                      {member.nickname || "No name"}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Compact Invite Link */}
            <div className="flex gap-2">
              <Input
                readOnly
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/join?groupId=${groupId}`
                    : ""
                }
                className="font-mono text-xs h-8"
              />
              <Button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/join?groupId=${groupId}`,
                    );
                  }
                }}
                size="sm"
                variant="outline"
                className="h-8"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Balance Card - Main Focus */}
        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-lg">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {settlementsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : settlements ? (
              <div className="space-y-4">
                {/* Large Balance Display */}
                <div>
                  <div
                    className={`text-5xl font-bold ${
                      settlements.total >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {settlements.total >= 0 ? "+" : "-"}$
                    {Math.abs(settlements.total).toFixed(2)}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {settlements.total > 0
                      ? "You are owed"
                      : settlements.total < 0
                        ? "You owe"
                        : "All settled up"}
                  </p>
                </div>

                {/* Collapsible Balance Details */}
                <Collapsible
                  open={isBalanceDetailsOpen}
                  onOpenChange={setIsBalanceDetailsOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="text-sm font-medium">View Details</span>
                      {isBalanceDetailsOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <Separator className="mb-3" />
                    <div className="space-y-2">
                      {Object.entries(settlements.settlements).map(
                        ([memberId, { nickname, amount }]) => {
                          if (amount === 0) return null;

                          return (
                            <div
                              key={memberId}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <span className="text-sm font-medium">
                                {nickname}
                              </span>
                              <span
                                className={`text-sm font-semibold ${
                                  amount > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {amount > 0
                                  ? `owes you $${amount.toFixed(2)}`
                                  : `you owe $${Math.abs(amount).toFixed(2)}`}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No balances to show
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{transaction.title}</h4>
                      <span className="text-lg font-bold text-green-600">
                        ${transaction.amount}
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
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                {transactions.length > 3 && (
                  <Button variant="ghost" className="w-full">
                    View All Transactions ({transactions.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All modal code remains commented as requested */}
      {/* {isCreateTransactionModalOpen && ( ... )} */}
      {/* {isCreateRecurringModalOpen && ( ... )} */}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageContent />
    </Suspense>
  );
}
