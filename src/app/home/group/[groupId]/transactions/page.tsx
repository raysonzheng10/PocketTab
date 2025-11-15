"use client";
import { Suspense } from "react";
import TransactionsPageContent from "./components/TransactionsPageContent";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <TransactionsPageContent />
    </Suspense>
  );
}
