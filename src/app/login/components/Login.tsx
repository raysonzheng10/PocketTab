"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseClient } from "@/app/utils/supabaseClient";
import { OtpForm } from "./OtpForm";
import { EmailForm } from "./EmailForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [sendOtpLoading, setSendOtpLoading] = useState<boolean>(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState<boolean>(false);

  const handleSendOtp = async () => {
    setError("");
    setSendOtpLoading(true);
    const { error } = await supabaseClient.auth.signInWithOtp({ email });
    setSendOtpLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otp) {
        setError("OTP is required");
        return;
      }

      setError("");
      setVerifyOtpLoading(true);

      const { data, error } = await supabaseClient.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) {
        setError(error.message);
        setVerifyOtpLoading(false);
        return;
      }

      if (!data?.user) {
        setError("Failed to retrieve user from OTP verification");
        setVerifyOtpLoading(false);
        return;
      }

      const setTokenRes = await fetch("/api/auth/setToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
        }),
      });

      if (!setTokenRes.ok) {
        const text = await setTokenRes.text();
        throw new Error(`Failed to set tokens: ${text}`);
      }

      const upsertRes = await fetch("/api/protected/user/upsert", {
        method: "POST",
      });
      const result = await upsertRes.json();

      if (result?.error) {
        throw new Error(result.error);
      }

      // use location.href to fully refresh the state, make sure cookies aren't stale
      window.location.href = redirectTo
        ? decodeURIComponent(redirectTo)
        : "/home";
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setVerifyOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {redirectTo && (
          <Alert variant="info">
            <AlertCircle className="size-4" />
            <AlertDescription>
              Please sign in first to continue joining this group
            </AlertDescription>
          </Alert>
        )}
        {isOtpSent ? (
          <OtpForm
            otp={otp}
            setOtp={setOtp}
            onVerify={handleVerifyOtp}
            isLoading={verifyOtpLoading}
            onResendCode={handleSendOtp}
          />
        ) : (
          <EmailForm
            email={email}
            setEmail={setEmail}
            onSendOtp={handleSendOtp}
            isLoading={sendOtpLoading}
          />
        )}
      </div>
    </div>
  );
}
