"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleLoginClick = async () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <h1 className="text-4xl font-bold mb-4 text-primary">PocketTab</h1>
      <p className="mb-6 text-lg">
        Split and track expenses with friends easily.
      </p>
      <Button size="lg" onClick={handleLoginClick}>
        Get Started
      </Button>
    </div>
  );
}
