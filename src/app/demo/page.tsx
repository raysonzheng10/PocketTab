"use client";
import { Suspense } from "react";
import { GroupPageContent } from "../home/group/[groupId]/page";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <GroupPageContent />
    </Suspense>
  );
}
