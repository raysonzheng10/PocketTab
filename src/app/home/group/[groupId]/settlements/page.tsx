"use client";
import { Suspense, useEffect, useState } from "react";
import { useError } from "@/app/home/context/ErrorContext";
import { useTransactions } from "../context/TransactionContext";
import { useRecurringTransactions } from "../context/RecurringTransactionContext";
import CreateReimbursementModal from "../components/CreateReimbursementModal/CreateReimbursementModal";
import SettlementsCard from "./components/SettlementsCard";

function PageContent() {
  const { setError } = useError();
  const { error: transactionsContextError } = useTransactions();
  const { error: recurringTransactionsContextError } =
    useRecurringTransactions();

  useEffect(() => {
    setError(transactionsContextError);
  }, [transactionsContextError, setError]);

  useEffect(() => {
    setError(recurringTransactionsContextError);
  }, [recurringTransactionsContextError, setError]);

  const [isCreateReimbursementModalOpen, setIsCreateReimbursementModalOpen] =
    useState<boolean>(false);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <SettlementsCard
          setIsCreateTransactionModalOpen={setIsCreateReimbursementModalOpen}
        />
      </div>
      <CreateReimbursementModal
        open={isCreateReimbursementModalOpen}
        onOpenChange={setIsCreateReimbursementModalOpen}
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
