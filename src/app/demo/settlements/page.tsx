"use client";
import SettlementsPageContent from "@/app/home/group/[groupId]/settlements/components/SettlementsPageContent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettlementsPageContent />
    </Suspense>
  );
}
