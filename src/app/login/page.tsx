"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "../utils/supabaseClient";

export default function Page() {
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

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data?.user) {
      setError("Failed to retrieve user from OTP verification");
      setIsLoading(false);
      return;
    }

    // Create or fetch user in your database
    await fetch("/api/auth/setToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      }),
    });

    const res = await fetch("/api/protected/user/upsert", {
      method: "POST",
    });

    const result = await res.json();
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      if (redirectTo) {
        // decode the redirect URL in case it was encoded
        const decodedRedirect = decodeURIComponent(redirectTo);
        router.push(decodedRedirect);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-black">
        <h1 className="text-2xl font-bold text-center mb-4">Divvy OTP Login</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {isOtpSent ? (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Confirm OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
