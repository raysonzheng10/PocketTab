import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, History } from "lucide-react";

interface ActionButtonsProps {
  onAddTransaction: () => void;
  onAddReimbursement: () => void;
}

export default function ActionButtons({
  onAddTransaction,
  onAddReimbursement,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button
        variant="outline"
        className="h-20 flex flex-col gap-2 rounded-2xl"
        onClick={onAddTransaction}
      >
        <Plus className="size-5" />
        <span className="text-xs text-wrap sm:text-sm">Add Transaction</span>
      </Button>

      <Button
        variant="outline"
        className="h-20 flex flex-col gap-2 rounded-2xl"
        onClick={onAddReimbursement}
      >
        <ArrowLeftRight className="size-5" />
        <span className="text-xs text-wrap sm:text-sm">Reimburse</span>
      </Button>

      <Button
        variant="outline"
        className="h-20 flex flex-col gap-2 rounded-2xl"
      >
        <History className="size-5" />
        <span className="text-xs text-wrap sm:text-sm">ASDF</span>
      </Button>
    </div>
  );
}
