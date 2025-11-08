"use client";
import { ReactNode, useEffect, useState } from "react";
import { RecurringTransactionProvider } from "./context/RecurringTransactionContext";
import { SettlementProvider } from "./context/SettlementContext";
import { TransactionProvider } from "./context/TransactionContext";
import { useParams, useRouter } from "next/navigation";
import { useError } from "../../context/ErrorContext";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GroupVerifier>
      <SettlementProvider>
        <TransactionProvider>
          <RecurringTransactionProvider>
            {children}
          </RecurringTransactionProvider>
        </TransactionProvider>
      </SettlementProvider>
    </GroupVerifier>
  );
}

function GroupVerifier({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setError } = useError();
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const params = useParams();

  useEffect(() => {
    const checkMembership = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/protected/groupMember/${params.groupId}`);
        const data = await res.json();
        if (res.ok && data.groupMember) setIsMember(true);
        else throw new Error();
      } catch {
        setError("You are not a part of this group.");
        window.location.href = "/home";
      } finally {
        setIsLoading(false);
      }
    };
    checkMembership();
  }, [params.groupId, router, setError]);

  if (isLoading) return <div className="p-6 text-center">Verifying…</div>;
  if (!isMember) return null;

  return <main>{children}</main>;
}
