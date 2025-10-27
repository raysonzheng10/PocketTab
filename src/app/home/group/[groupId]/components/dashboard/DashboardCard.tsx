"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import RecentTransactions from "./RecentTransactions";
import SettlementDetails from "./SettlementDetails";

export interface DashboardCardProps {
  openCreateTransactionModal: (open: boolean) => void;
}
export default function DashboardCard({
  openCreateTransactionModal,
}: DashboardCardProps) {
  const { settlementsLoading, transactionsLoading } = useGroup();

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

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4">
        {/* Settlement information */}
        <SettlementDetails />
        <Separator />

        {/* Recent Transactions */}
        <RecentTransactions
          onCreateTransaction={() => openCreateTransactionModal(true)}
        />
      </CardContent>
    </Card>
  );
}
