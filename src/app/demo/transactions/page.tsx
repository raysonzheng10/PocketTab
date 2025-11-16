"use client";
import TransactionsPageContent from "@/app/home/group/[groupId]/transactions/components/TransactionsPageContent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <TransactionsPageContent />
    </Suspense>
  );
}
