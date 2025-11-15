import { useError } from "@/app/home/context/ErrorContext";
import { useGroup } from "@/app/home/context/GroupContext";
import { useEffect, useState } from "react";
import CreateReimbursementModal from "./CreateReimbursementModal/CreateReimbursementModal";
import CreateTransactionModal from "./CreateTransactionModal/CreateTransactionModal";
import ActionButtons from "./dashboard/ActionButtons";
import DashboardCard from "./dashboard/DashboardCard/DashboardCard";
import GroupCard from "./dashboard/GroupCard/GroupCard";

export default function GroupPageContent() {
  const { setError } = useError();
  const { error: groupContextError } = useGroup();

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState<boolean>(false);
  const [isCreateReimbursementModalOpen, setIsCreateReimbursementModalOpen] =
    useState<boolean>(false);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <GroupCard />

        <ActionButtons
          onAddTransaction={() => setIsCreateTransactionModalOpen(true)}
          onAddReimbursement={() => setIsCreateReimbursementModalOpen(true)}
        />

        <DashboardCard />
      </div>
      <CreateTransactionModal
        open={isCreateTransactionModalOpen}
        onOpenChange={setIsCreateTransactionModalOpen}
      />
      <CreateReimbursementModal
        open={isCreateReimbursementModalOpen}
        onOpenChange={setIsCreateReimbursementModalOpen}
      />
    </div>
  );
}
