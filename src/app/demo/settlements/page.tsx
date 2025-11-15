"use client";
import { Suspense } from "react";
import { SettlementsPageContent } from "@/app/home/group/[groupId]/settlements/page";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettlementsPageContent />
    </Suspense>
  );
}
