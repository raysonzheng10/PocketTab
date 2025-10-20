import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Login to PocketTab
        </CardTitle>
        <CardDescription>
          Enter your email below, and we will send your login code. Use that
          code on your next step.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            className="h-11"
          />
        </div>

        <Button
          onClick={onSendOtp}
          disabled={isLoading}
          className="w-full h-11"
          size="lg"
        >
          {isLoading ? "Sending code..." : "Send login code"}
        </Button>

        <p className="text-xs text-center text-muted-foreground pt-2">
          By continuing, you agree to receive a one-time code via email
        </p>
      </CardContent>
    </Card>
  );
}
