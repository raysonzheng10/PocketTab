"use client";
import { ReactNode, useEffect } from "react";
import { RecurringTransactionProvider } from "./context/RecurringTransactionContext";
import { SettlementProvider } from "./context/SettlementContext";
import { TransactionProvider } from "./context/TransactionContext";
import { useParams } from "next/navigation";
import { useError } from "../../context/ErrorContext";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GroupVerifier>
      <TransactionProvider>
        <SettlementProvider>
          <RecurringTransactionProvider>
            {children}
          </RecurringTransactionProvider>
        </SettlementProvider>
      </TransactionProvider>
    </GroupVerifier>
  );
}

function GroupVerifier({ children }: { children: ReactNode }) {
  const { setError } = useError();
  const params = useParams();

  useEffect(() => {
    const checkMembership = async () => {
      try {
        const res = await fetch(`/api/protected/groupMember/${params.groupId}`);
        const data = await res.json();

        if (!res.ok || !data.groupMember) {
          throw new Error();
        }
      } catch {
        setError("You are not a part of this group.");
        window.location.href = "/home";
      }
    };
    checkMembership();
  }, [params.groupId, setError]);

  return <main>{children}</main>;
}
