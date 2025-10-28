// components/SettlementDetails.tsx
"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSettlements } from "../../context/SettlementContext";

export default function SettlementDetails() {
  const router = useRouter();
  const { groupId } = useGroup();
  const { settlements } = useSettlements();

  const handleNavigateSettlements = () => {
    if (!groupId) return;
    router.push(`/home/group/${groupId}/settlements`);
  };

  const total = settlements?.total ?? 0;
  const isSettled = total === 0;
  const positive = total > 0;
  const formattedTotal = Math.abs(total).toFixed(2);

  const unsettled = useMemo(() => {
    if (!settlements) return [];
    return Object.entries(settlements.settlements).filter(
      ([, { amount }]) => amount !== 0,
    );
  }, [settlements]);

  return (
    <div>
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-xl font-semibold">
          {isSettled
            ? "You're all settled up!"
            : positive
              ? "Others owe you"
              : "You currently owe"}
        </h3>
        {unsettled.length > 0 && (
          <Button onClick={handleNavigateSettlements} variant={"outline"}>
            See Settlements
          </Button>
        )}
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

      <div className="text-sm text-gray-600 mt-3">
        {unsettled.length > 0
          ? `You have ${unsettled.length} unsettled debt${
              unsettled.length > 1 ? "s" : ""
            }`
          : "No unsettled debts"}
      </div>
    </div>
  );
}
