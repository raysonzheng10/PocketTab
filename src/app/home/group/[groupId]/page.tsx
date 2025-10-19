"use client";
import { Suspense, useEffect } from "react";
// import { useParams } from "next/navigation";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "../../context/GroupContext";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Copy, Users, ChevronDown, ChevronUp } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
import GroupCard from "./components/dashboard/GroupCard";

function PageContent() {
  const { setError } = useError();
  const { error: groupContextError } = useGroup();

  // const [isBalanceDetailsOpen, setIsBalanceDetailsOpen] = useState(false);

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  // const params = useParams();
  // const groupId = params.groupId as string;

  // const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Compact Group Info Header */}
        <GroupCard />

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
