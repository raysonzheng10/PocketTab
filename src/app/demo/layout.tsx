"use client";
import { ErrorProvider } from "../home/context/ErrorContext";
import { UserProvider } from "../home/context/UserContext";
import { GroupProvider } from "../home/context/GroupContext";
import { HomeLayoutContent } from "../home/layout";
import { SettlementProvider } from "../home/group/[groupId]/context/SettlementContext";
import { TransactionProvider } from "../home/group/[groupId]/context/TransactionContext";
import { RecurringTransactionProvider } from "../home/group/[groupId]/context/RecurringTransactionContext";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorProvider>
      <UserProvider>
        <GroupProvider>
          <HomeLayoutContent>
            <SettlementProvider>
              <TransactionProvider>
                <RecurringTransactionProvider>
                  {children}
                </RecurringTransactionProvider>
              </TransactionProvider>
            </SettlementProvider>
          </HomeLayoutContent>
        </GroupProvider>
      </UserProvider>
    </ErrorProvider>
  );
}
