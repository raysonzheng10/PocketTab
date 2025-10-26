"use client";
import { Suspense, useEffect, useState } from "react";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "../../context/GroupContext";
import GroupCard from "./components/dashboard/GroupCard";
import CreateTransactionModal from "./components/dashboard/CreateTransactionModal/CreateTransactionModal";
import DashboardCard from "./components/dashboard/DashboardCard";

function PageContent() {
  const { setError } = useError();
  const { error: groupContextError } = useGroup();

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState<boolean>(false);

  return (
    <div className="h-screen overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <GroupCard />
        <DashboardCard
          openCreateTransactionModal={setIsCreateTransactionModalOpen}
        />
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
