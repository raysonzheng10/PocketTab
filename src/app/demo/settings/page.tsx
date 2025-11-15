"use client";
import { SettingsPageContent } from "@/app/home/group/[groupId]/settings/page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettingsPageContent />
    </Suspense>
  );
}
