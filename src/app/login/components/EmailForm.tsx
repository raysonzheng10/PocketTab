import { Input } from "./basics/Input";
import { Button } from "./basics/Button";

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSendOtp: () => void;
  isLoading: boolean;
}

export function EmailForm({
  email,
  setEmail,
  onSendOtp,
  isLoading,
}: EmailFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Login to Divvy
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Enter your email below, and we will send your login code. Use that
          code on your next step.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
          />
        </div>

        <Button onClick={onSendOtp} isLoading={isLoading}>
          {isLoading ? "Sending code..." : "Send login code"}
        </Button>
      </div>

      <p className="text-xs text-center text-gray-500">
        By continuing, you agree to receive a one-time code via email
      </p>
    </div>
  );
}
