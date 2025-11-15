"use client";
import { Suspense } from "react";
import GroupPageContent from "./components/GroupPageContent";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <GroupPageContent />
    </Suspense>
  );
}
