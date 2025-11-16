"use client";

import { Suspense } from "react";
import SettlementsPageContent from "./components/SettlementsPageContent";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <SettlementsPageContent />
    </Suspense>
  );
}
