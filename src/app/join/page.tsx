"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function JoinGroup() {
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

      router.push(`/home/group/${groupId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  }, [groupId, router]);

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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Join Group
          </h2>
          <p className="text-gray-600">
            There was an error when trying to join this group. Check to make
            sure the URL is correct and refresh to try again.
          </p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Joining group...</p>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      }
    >
      <JoinGroup />
    </Suspense>
  );
}
