"use client";
import { Suspense } from "react";
import MembersCard from "./components/MembersCard";

function PageContent() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <MembersCard />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageContent />
    </Suspense>
  );
}
