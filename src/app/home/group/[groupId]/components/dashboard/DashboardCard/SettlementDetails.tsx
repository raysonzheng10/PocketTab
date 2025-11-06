// components/SettlementDetails.tsx
"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSettlements } from "../../../context/SettlementContext";

export default function SettlementDetails() {
  const router = useRouter();
  const { groupId } = useGroup();
  const { settlements, settlementTotal } = useSettlements();

  const handleNavigateSettlements = () => {
    if (!groupId) return;
    router.push(`/home/group/${groupId}/settlements`);
  };

  const isSettled = settlementTotal === 0;
  const positive = settlementTotal > 0;
  const formattedTotal = Math.abs(settlementTotal).toFixed(2);

  const { owedToYou, youOwe } = useMemo(() => {
    if (!settlements) return { owedToYou: 0, youOwe: 0 };

    const owedToYou = settlements.filter(({ amount }) => amount >= 0.01).length;
    const youOwe = settlements.filter(({ amount }) => amount <= -0.01).length;

    return { owedToYou, youOwe };
  }, [settlements]);

  const hasUnsettled = owedToYou > 0 || youOwe > 0;

  return (
    <div>
      <div className="flex flex-row items-center justify-between pb-3">
        <h3 className="text-lg sm:text-xl truncate font-semibold">
          Your Balance
        </h3>
        {hasUnsettled && (
          <Button
            onClick={handleNavigateSettlements}
            variant="outline"
            size="sm"
          >
            All Settlements
          </Button>
        )}
      </div>

      <div
        className={`flex flex-row-reverse items-center text-3xl sm:text-5xl font-bold tracking-tight mt-2 ${
          isSettled
            ? "text-gray-500"
            : positive
              ? "text-green-600"
              : "text-red-600"
        }`}
      >
        <p>
          {isSettled ? "$0.00" : `${positive ? "+" : "-"}$${formattedTotal}`}
        </p>
      </div>

      <div className="text-sm text-muted-foreground mt-3">
        {isSettled ? (
          "All settled up!"
        ) : (
          <>
            {owedToYou > 0 &&
              `${owedToYou} ${owedToYou === 1 ? "person owes" : "people owe"} you`}
            {owedToYou > 0 && youOwe > 0 && " • "}
            {youOwe > 0 &&
              `You owe ${youOwe} ${youOwe === 1 ? "person" : "people"}`}
          </>
        )}
      </div>
    </div>
  );
}
