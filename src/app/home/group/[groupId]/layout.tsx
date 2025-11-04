"use client";
import { RecurringTransactionProvider } from "./context/RecurringTransactionContext";
import { SettlementProvider } from "./context/SettlementContext";
import { TransactionProvider } from "./context/TransactionContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettlementProvider>
      <TransactionProvider>
        <RecurringTransactionProvider>{children}</RecurringTransactionProvider>
      </TransactionProvider>
    </SettlementProvider>
  );
}
