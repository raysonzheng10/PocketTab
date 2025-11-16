import { useError } from "@/app/home/context/ErrorContext";
import { useEffect, useState } from "react";
import CreateReimbursementModal from "../../components/CreateReimbursementModal/CreateReimbursementModal";
import { useRecurringTransactions } from "../../context/RecurringTransactionContext";
import { useTransactions } from "../../context/TransactionContext";
import SettlementsCard from "./SettlementsCard";

export default function SettlementsPageContent() {
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
