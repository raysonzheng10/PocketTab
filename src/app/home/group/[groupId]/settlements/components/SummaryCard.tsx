import { useSettlements } from "../../context/SettlementContext";

export default function SummaryCard() {
  const { settlementTotal } = useSettlements();

  const isSettled = settlementTotal === 0;
  const positive = settlementTotal > 0;
  const formattedTotal = Math.abs(settlementTotal).toFixed(2);

  return (
    <div className="p-6 mb-4 border-2 rounded-lg">
      {!isSettled ? (
        <div className="text-center">
          <div className="text-md mb-2">
            {positive ? "You’re Owed" : "You Owe"}
          </div>
          <div
            className={`text-2xl sm:text-4xl font-bold truncate ${
              positive ? "text-green-600" : "text-red-600"
            }`}
          >
            ${formattedTotal}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-md font-semibold">All Settled Up</div>
          <div className="text-sm text-muted-foreground mt-1">
            You owe no one money and no one owes you.
          </div>
        </div>
      )}
    </div>
  );
}
