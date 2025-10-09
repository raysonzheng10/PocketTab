"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleJoinGroup = useCallback(async () => {
    try {
      const res = await fetch("/api/protected/group/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to join group");
      }

      router.push(`/dashboard/group?groupId=${groupId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  }, [groupId, router]);

  console.log("groupID: ", groupId);
  useEffect(() => {
    if (groupId) {
      handleJoinGroup();
    } else {
      setError("Invalid join url");
    }
  }, [groupId, handleJoinGroup]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error Joining Group
          </h2>
          <p className="text-gray-700">{error}</p>
        </div>
      ) : (
        <Suspense fallback={<p>fall back SUSPENSE</p>}>
          <p className="text-lg text-gray-700">Joining group {groupId}...</p>
        </Suspense>
      )}
    </div>
  );
}
