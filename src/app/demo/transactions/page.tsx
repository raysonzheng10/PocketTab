"use client";
import { Suspense } from "react";
import { TransactionsPageContent } from "@/app/home/group/[groupId]/transactions/page";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <TransactionsPageContent />
    </Suspense>
  );
}
