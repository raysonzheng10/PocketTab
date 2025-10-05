"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleLoginClick = async () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black">
      <h1 className="text-4xl font-bold mb-4">Divvy</h1>
      <p className="mb-6 text-lg">
        Split and track expenses with friends easily.
      </p>
      <button
        onClick={handleLoginClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Login / Get Started
      </button>
    </div>
  );
}
