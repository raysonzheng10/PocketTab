"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "../../context/GroupContext";
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

  // const [isBalanceDetailsOpen, setIsBalanceDetailsOpen] = useState(false);

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  const params = useParams();
  const groupId = params.groupId as string;

  // const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Compact Group Info Header */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
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

        {/* Recent Transactions Card */}
        {/* <Card>
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
        </Card> */}
      </div>
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
