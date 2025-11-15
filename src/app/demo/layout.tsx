"use client";
import { ErrorProvider } from "../home/context/ErrorContext";
import { UserProvider } from "../home/context/UserContext";
import { GroupProvider } from "../home/context/GroupContext";
import { SettlementProvider } from "../home/group/[groupId]/context/SettlementContext";
import { TransactionProvider } from "../home/group/[groupId]/context/TransactionContext";
import { RecurringTransactionProvider } from "../home/group/[groupId]/context/RecurringTransactionContext";
import HomeLayoutContent from "../home/components/HomeLayoutContent";

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
            <TransactionProvider>
              <SettlementProvider>
                <RecurringTransactionProvider>
                  {children}
                </RecurringTransactionProvider>
              </SettlementProvider>
            </TransactionProvider>
          </HomeLayoutContent>
        </GroupProvider>
      </UserProvider>
    </ErrorProvider>
  );
}
