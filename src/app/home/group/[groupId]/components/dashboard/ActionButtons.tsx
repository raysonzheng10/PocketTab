import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
        className="h-20 flex flex-col gap-2 rounded-2xl"
        onClick={onAddReimbursement}
      >
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
