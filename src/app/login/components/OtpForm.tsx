import { Input } from "./basics/Input";
import { Button } from "./basics/Button";

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
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            autoComplete="one-time-code"
            autoFocus
          />
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
