"use client";
import { Suspense, useEffect, useState } from "react";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "../../context/GroupContext";
import GroupCard from "./components/dashboard/GroupCard";
import CreateTransactionModal from "./components/CreateTransactionModal/CreateTransactionModal";
import DashboardCard from "./components/dashboard/DashboardCard/DashboardCard";
import ActionButtons from "./components/dashboard/ActionButtons";

function PageContent() {
  const { setError } = useError();
  const { error: groupContextError } = useGroup();

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState<boolean>(false);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <GroupCard />

        <ActionButtons
          onAddTransaction={() => setIsCreateTransactionModalOpen(true)}
        />

        <DashboardCard />
      </div>
      <CreateTransactionModal
        open={isCreateTransactionModalOpen}
        onOpenChange={setIsCreateTransactionModalOpen}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageContent />
    </Suspense>
  );
}
