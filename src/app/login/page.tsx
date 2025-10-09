"use client";
import { Suspense } from "react";
import LoginForm from "./components/LoginForm";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <LoginForm />
    </Suspense>
  );
}
