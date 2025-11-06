import { TrendingDown, TrendingUp } from "lucide-react";

export default function BreakdownCards({
  totalOwed,
  totalCredits,
}: {
  totalOwed: number;
  totalCredits: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center text-sm text-red-700 mb-1">
          <TrendingDown className="w-4 h-4 mr-1" />
          You Owe
        </div>
        <div className="text-md sm:text-xl font-bold text-red-600 truncate">
          ${totalOwed.toFixed(2)}
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center text-sm text-green-700 mb-1">
          <TrendingUp className="w-4 h-4 mr-1" />
          Owed to You
        </div>
        <div className="text-md sm:text-xl font-bold text-green-600 truncate">
          ${totalCredits.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
