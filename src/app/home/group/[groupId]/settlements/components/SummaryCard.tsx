import { useSettlements } from "../../context/SettlementContext";

export default function SummaryCard() {
  const { settlementTotal } = useSettlements();

  return (
    <div className="p-6 mb-4 border-2 rounded-lg">
      <div className="text-center">
        <div className="text-md mb-2">Net Balance</div>
        <div
          className={`text-2xl sm:text-4xl  font-bold truncate ${
            settlementTotal >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {settlementTotal >= 0 ? "+" : ""}${settlementTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
