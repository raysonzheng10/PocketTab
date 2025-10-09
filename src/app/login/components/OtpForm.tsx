import { Button } from "./basics/Button";
import { useRef } from "react";
import { isDigit } from "@/app/utils/utils";

interface OtpFormProps {
  otp: string;
  setOtp: (otp: string) => void;
  onVerify: () => void;
  onResendCode: () => void;
  isLoading: boolean;
}

export function OtpForm({
  otp,
  setOtp,
  onVerify,
  onResendCode,
  isLoading,
}: OtpFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Enter your login code
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Check your email for a 6-digit code from Supabase Auth and enter it
          here
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Verification code
          </label>
          <OtpInput otp={otp} setOtp={setOtp} />
        </div>

        <Button onClick={onVerify} isLoading={isLoading}>
          {isLoading ? "Verifying..." : "Verify code"}
        </Button>
      </div>

      <p className="text-xs text-center text-gray-500">
        Didn&apos;t receive a code?{" "}
        <button
          onClick={onResendCode}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Resend code
        </button>
      </p>
    </div>
  );
}

interface OtpInputProps {
  otp: string;
  setOtp: (otp: string) => void;
}

function OtpInput({ otp, setOtp }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpArray = Array.from({ length: 6 }, (_, i) => otp[i] || "");

  // Handle typing
  const handleChange = (index: number, value: string) => {
    if (!isDigit(value)) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value[0]; // replace current index
    setOtp(newOtpArray.join(""));
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle delete/backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otpArray[index]) {
        // delete current
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        setOtp(newOtpArray.join(""));
      } else if (index > 0) {
        // move focus back
        inputRefs.current[index - 1]?.focus();
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = "";
        setOtp(newOtpArray.join(""));
      }
    }
  };

  // Handle paste
  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (!paste) return;

    const newOtpArray = [...otpArray];
    for (let i = 0; i < paste.length && index + i < 6; i++) {
      newOtpArray[index + i] = paste[i];
    }
    setOtp(newOtpArray.join(""));
    const nextFocus = Math.min(index + paste.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  return (
    <div className="flex gap-2 justify-between">
      {otpArray.map((digit, index) => (
        <input
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onFocus={(e) => e.target.select()}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}
