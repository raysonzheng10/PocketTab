"use client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorAlertProps {
  error: string;
  onDismiss: () => void;
}

export function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4">
      <Alert variant="destructive" className="shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={onDismiss}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
