"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/app/utils/supabaseClient";
import { OtpForm } from "./OtpForm";
import { EmailForm } from "./EmailForm";
import { ErrorCard } from "./basics/ErrorCard";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    setIsLoading(true);
    const { error } = await supabaseClient.auth.signInWithOtp({ email });
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setError("");
    setIsLoading(true);
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    // return if OTP verification failed
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    } else if (!data?.user) {
      setError("Failed to retrieve user from OTP verification");
      setIsLoading(false);
      return;
    }

    await fetch("/api/auth/setToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      }),
    });

    const res = await fetch("/api/protected/user/upsert", { method: "POST" });
    const result = await res.json();

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      const destination = redirectTo
        ? decodeURIComponent(redirectTo)
        : "/dashboard";
      router.push(destination);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md border border-blue-100">
        <ErrorCard message={error} />

        {isOtpSent ? (
          <OtpForm
            otp={otp}
            setOtp={setOtp}
            onVerify={handleVerifyOtp}
            isLoading={isLoading}
            onResendCode={handleSendOtp}
          />
        ) : (
          <EmailForm
            email={email}
            setEmail={setEmail}
            onSendOtp={handleSendOtp}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
