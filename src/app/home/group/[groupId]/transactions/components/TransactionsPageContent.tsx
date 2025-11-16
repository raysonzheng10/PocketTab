import { useError } from "@/app/home/context/ErrorContext";
import { useEffect, useState } from "react";
import CreateTransactionModal from "../../components/CreateTransactionModal/CreateTransactionModal";
import { useRecurringTransactions } from "../../context/RecurringTransactionContext";
import { useTransactions } from "../../context/TransactionContext";
import TransactionsCard from "./TransactionsCard";

export default function TransactionsPageContent() {
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

  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] =
    useState<boolean>(false);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <TransactionsCard
          setIsCreateTransactionModalOpen={setIsCreateTransactionModalOpen}
        />
      </div>
      <CreateTransactionModal
        open={isCreateTransactionModalOpen}
        onOpenChange={setIsCreateTransactionModalOpen}
      />
    </div>
  );
}
