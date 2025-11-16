"use client";
import { Suspense } from "react";
import SettingsPageContent from "@/app/home/group/[groupId]/settings/components/SettingsPageContent";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettingsPageContent />
    </Suspense>
  );
}
