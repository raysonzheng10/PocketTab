"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DemoAlert() {
  const router = useRouter();
  const navigateToLogin = () => {
    router.push("/login");
  };
  return (
    <div className="fixed bottom-4 right-4 z-[60] max-w-3/4">
      <Alert variant="info" className="shadow-sm cursor-default">
        <AlertDescription className="text-xs sm:text-sm ">
          <span>
            This is a demo - data/changes will reset on refresh. Some features
            unavailable.{" "}
            <Button
              variant="link"
              onClick={navigateToLogin}
              className="p-0 h-auto text-xs sm:text-sm"
            >
              Log in
            </Button>{" "}
            for the full version.
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
