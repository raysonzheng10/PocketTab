"use client";
import { Suspense } from "react";
import SettingsPageContent from "./components/SettingsPageContent";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettingsPageContent />
    </Suspense>
  );
}
