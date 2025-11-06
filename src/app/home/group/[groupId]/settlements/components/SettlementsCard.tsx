import { Card, CardContent } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { useSettlements } from "../../context/SettlementContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import SettlementCardSkeleton from "./SettlementCardSkeleton";
import BreakdownCards from "./BreakdownCards";
import SummaryCard from "./SummaryCard";
import { DetailedSettlement } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettlementsCardProps {
  setIsCreateTransactionModalOpen: (open: boolean) => void;
}

export default function SettlementsCard({
  setIsCreateTransactionModalOpen,
}: SettlementsCardProps) {
  const { settlementsLoading } = useSettlements();

  const settlements = [
    { groupMemberId: "1001", nickname: "Sarah", amount: 23.0 },
    {
      groupMemberId: "1003",
      nickname: "Emmdasjdklasjkldasjkldjaskldjsakldsajdjsakldjaskla",
      amount: 67.25,
    },

    { groupMemberId: "1009", nickname: "Morgan", amount: -19.99 },
  ];
  const debtSettlements =
    settlements
      ?.filter(({ amount }) => amount <= -0.01)
      .sort((a, b) => a.amount - b.amount) ?? [];

  const creditSettlements =
    settlements
      ?.filter(({ amount }) => amount >= 0.01)
      .sort((a, b) => b.amount - a.amount) ?? [];

  const totalOwed = Math.abs(
    debtSettlements.reduce((sum, s) => sum + s.amount, 0),
  );
  const totalCredits = creditSettlements.reduce((sum, s) => sum + s.amount, 0);

  const fullySettled =
    debtSettlements.length === 0 && creditSettlements.length === 0;

  if (settlementsLoading) {
    return <SettlementCardSkeleton />;
  }

  return (
    <Card className="shadow-sm overflow-auto">
      <CardContent className="pt-0 space-y-3">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlements</h1>
          <p className="text-gray-600">Manage what you owe to others</p>
        </div>
        {/* Information Cards */}
        <SummaryCard />
        <BreakdownCards totalOwed={totalOwed} totalCredits={totalCredits} />

        <Separator className="my-8" />

        {fullySettled ? (
          <div className="bg-emerald-50 rounded-lg shadow-sm p-12 text-center border-2 border-green-200">
            <Check className="size-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">All Settled Up!</h3>
            <p className="text-gray-600 text-lg">
              You have no outstanding balances with anyone in your group
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Debts Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <SectionHeader
                headerText={`Payments Due (${debtSettlements.length})`}
                isPositive={false}
                tooltipText="Create a reimbursement to clear your owed balances"
                setIsCreateTransactionModalOpen={
                  setIsCreateTransactionModalOpen
                }
              />

              {debtSettlements.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[300px] max-w-full overflow-y-auto">
                  {debtSettlements.map((debt) => (
                    <SettlementLineItem
                      key={debt.groupMemberId}
                      settlement={debt}
                    />
                  ))}
                </div>
              ) : (
                <SectionClear description="You do not owe anyone money right now." />
              )}
            </div>

            {/* Credits Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <SectionHeader
                headerText={`Awaiting Payments (${creditSettlements.length})`}
                isPositive={true}
                tooltipText="These balances will update automatically once others
                      record their reimbursements to you"
              />

              {creditSettlements.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[300px] max-w-full overflow-y-auto">
                  {creditSettlements.map((credit) => (
                    <SettlementLineItem
                      key={credit.groupMemberId}
                      settlement={credit}
                    />
                  ))}
                </div>
              ) : (
                <SectionClear description="You are not waiting on anyone to repay you." />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  headerText,
  tooltipText,
  isPositive,
  setIsCreateTransactionModalOpen,
}: {
  headerText: string;
  tooltipText?: string;
  isPositive: boolean;
  setIsCreateTransactionModalOpen?: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-row gap-2 justify-between items-center mb-4 h-12">
      <div className="flex flex-row items-center gap-2 min-w-0">
        {tooltipText && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
          </Tooltip>
        )}
        <h2
          className={`text-md sm:text-xl font-semibold truncate block ${
            isPositive ? "text-green-700" : "text-red-700"
          }`}
        >
          {headerText}
        </h2>
      </div>
      {setIsCreateTransactionModalOpen && (
        <Button
          size={"sm"}
          variant="default"
          onClick={() => setIsCreateTransactionModalOpen(true)}
        >
          Reimburse
        </Button>
      )}
    </div>
  );
}

function SettlementLineItem({
  settlement,
}: {
  settlement: DetailedSettlement;
}) {
  const negative = settlement.amount < 0.0;

  return (
    <div className="border rounded-lg shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center justify-between w-full">
        <div className="min-w-0 flex-1 pr-4">
          <span className="font-semibold text-lg truncate block">
            {settlement.nickname}
          </span>
          <span className="text-sm text-gray-500">
            {negative ? "You owe" : "Owes you"}
          </span>
        </div>

        <div className="flex flex-col items-end flex-shrink-0 w-[90px]">
          <span
            className={`text-lg sm:text-2xl font-bold ${
              negative ? "text-red-600" : "text-green-600"
            }`}
          >
            ${Math.abs(settlement.amount).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionClear({ description }: { description: string }) {
  return (
    <div className="flex flex-col gap-2 border rounded-lg shadow-sm p-6 text-center">
      <Check className="size-14 text-green-500 mx-auto" />
      <h3 className="text-xl font-semibold">All Clear!</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
