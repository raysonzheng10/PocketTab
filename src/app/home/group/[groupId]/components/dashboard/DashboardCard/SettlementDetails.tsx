// components/SettlementDetails.tsx
"use client";
import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSettlements } from "../../../context/SettlementContext";

export default function SettlementDetails() {
  const pathname = usePathname();
  const router = useRouter();
  const { group } = useGroup();
  const { settlements, settlementTotal } = useSettlements();

  const isDemoPage = pathname.startsWith("/demo");
  const handleNavigateSettlements = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push(`/demo/settlements`);
    } else {
      router.push(`/home/group/${group.id}/settlements`);
    }
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
      {!isSettled ? (
        <>
          <div className="flex flex-row items-center justify-between pb-3">
            <h3 className="text-lg sm:text-xl truncate font-semibold">
              {positive ? "You're Owed" : "You Owe"}
            </h3>
            {hasUnsettled && (
              <Button
                onClick={handleNavigateSettlements}
                variant="outline"
                size="sm"
              >
                View Settlements
              </Button>
            )}
          </div>

          <div
            className={`flex flex-row-reverse items-center text-3xl sm:text-5xl font-bold tracking-tight mt-2 ${
              positive ? "text-green-600" : "text-red-600"
            }`}
          >
            ${formattedTotal}
          </div>

          <div className="text-sm text-muted-foreground mt-3">
            {owedToYou > 0 && (
              <span>
                {`${owedToYou} ${owedToYou === 1 ? "person owes" : "people owe"} you`}
              </span>
            )}
            {owedToYou > 0 && youOwe > 0 && <span> • </span>}
            {youOwe > 0 && (
              <span className="text-red-600 font-semibold">
                {`You owe ${youOwe} ${youOwe === 1 ? "person" : "people"}`}
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl text-primary font-semibold">
            All Settled Up
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You owe no one money and no one owes you.
          </p>
        </div>
      )}
    </div>
  );
}
