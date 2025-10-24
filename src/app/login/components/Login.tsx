"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/app/utils/supabaseClient";
import { OtpForm } from "./OtpForm";
import { EmailForm } from "./EmailForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Login() {
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
    try {
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

      if (error) {
        setError(error.message);
        return;
      }

      if (!data?.user) {
        setError("Failed to retrieve user from OTP verification");
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

      const destination = redirectTo ? decodeURIComponent(redirectTo) : "/home";
      console.log("Routing to", destination);
      router.push(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
