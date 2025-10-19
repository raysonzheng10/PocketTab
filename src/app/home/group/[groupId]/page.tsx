"use client";
import { Suspense, useEffect } from "react";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "../../context/GroupContext";
import GroupCard from "./components/dashboard/GroupCard";
import SettlementCard from "./components/dashboard/SettlementCard";
import TransactionCard from "./components/dashboard/TransactionCard";

function PageContent() {
  const { setError } = useError();
  const { error: groupContextError } = useGroup();

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Group header always on its own row */}
        <GroupCard />

        {/* Settlement cards layout */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="flex-1">
            <SettlementCard />
          </div>
          <div className="flex-1">
            <TransactionCard />
          </div>
        </div>
      </div>
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
