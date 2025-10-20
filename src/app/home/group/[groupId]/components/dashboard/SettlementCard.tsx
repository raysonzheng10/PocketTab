"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SettlementCard() {
  const { group, settlements, settlementsLoading } = useGroup();
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

  if (settlementsLoading)
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
        </CardContent>
      </Card>
    );

  const total = settlements?.total ?? 0;
  const isSettled = total === 0;
  const positive = total > 0;
  const formattedTotal = Math.abs(total).toFixed(2);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center justify-between pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          {isSettled
            ? "You're all settled up!"
            : positive
              ? "Others owe you"
              : "You currently owe"}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleNavigateSettlements}>
          {navigateLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          See All Settlements
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
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
      </CardContent>
    </Card>
  );
}
