"use client";
import { Suspense } from "react";
import MemberSettingsCard from "./components/MemberSettingsCard/MemberSettingsCard";
import GroupSettingsCard from "./components/GroupSettingsCard/GroupSettingsCard";

export function SettingsPageContent() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <GroupSettingsCard />
        <MemberSettingsCard />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettingsPageContent />
    </Suspense>
  );
}
