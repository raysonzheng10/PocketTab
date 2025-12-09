import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSettlements } from "../../context/SettlementContext";

interface ActionButtonsProps {
  onAddTransaction: () => void;
  onAddReimbursement: () => void;
}

export default function ActionButtons({
  onAddTransaction,
  onAddReimbursement,
}: ActionButtonsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { group } = useGroup();
  const { settlements } = useSettlements();

  const youOwe = useMemo(() => {
    if (!settlements) return 0;
    return settlements.filter(({ amount }) => amount <= -0.01).length;
  }, [settlements]);

  const isDemoPage = pathname.startsWith("/demo");
  const onMoveToSettings = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push(`/demo/settings`);
    } else {
      router.push(`/home/group/${group.id}/settings`);
    }
  };
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
        className="h-20 flex flex-col gap-2 rounded-2xl relative"
        onClick={onAddReimbursement}
      >
        {youOwe > 0 && (
          <div className="absolute top-2 right-2 min-w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{youOwe}</span>
          </div>
        )}
        <ArrowLeftRight className="size-5" />
        <span className="text-xs text-wrap sm:text-sm">Reimburse</span>
      </Button>

      <Button
        variant="outline"
        className="h-20 flex flex-col gap-2 rounded-2xl"
        onClick={onMoveToSettings}
      >
        <Settings className="size-5" />
        <span className="text-xs text-wrap sm:text-sm">Settings</span>
      </Button>
    </div>
  );
}
