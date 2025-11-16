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
    <div className="fixed top-16 left-4 max-w-3/4 w-fit lg:top-4 lg:left-auto lg:right-4 lg:translate-x-0 z-[20] lg:max-w-3/4">
      <Alert variant="info" className="shadow-sm cursor-default">
        <AlertDescription className="text-xs sm:text-sm">
          <span className="lg:hidden">
            This is a demo -{" "}
            <Button
              variant="link"
              onClick={navigateToLogin}
              className="p-0 h-auto text-xs sm:text-sm"
            >
              log in
            </Button>{" "}
            for all features.
          </span>
          <span className="hidden lg:inline">
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
