"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../home/context/UserContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function JoinGroup() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const router = useRouter();
  const { userGroups, userGroupsLoading } = useUser();

  const [error, setError] = useState<string | null>(null);

  const handleJoinGroup = useCallback(async () => {
    // Check if user already has 5 groups
    if (userGroups.length >= 5) {
      setError(
        "You are currently in 5 groups, which is the limit. To join another group, leave one of your current groups.",
      );
      return;
    }

    try {
      const res = await fetch("/api/protected/group/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        // For any error from backend, assume bad URL/bad request
        setError(
          data.error ??
            "The invite link may be invalid, please refresh to try again.",
        );
        return;
      }

      router.push(`/home/group/${groupId}`);
    } catch {
      // Network or other unexpected errors
      setError(
        "The invite link may be invalid or expired. Check that the link is correct and refresh to try again.",
      );
    }
  }, [groupId, router, userGroups.length]);

  useEffect(() => {
    // Wait for user groups to load before attempting to join
    if (userGroupsLoading) return;

    if (groupId) {
      handleJoinGroup();
    } else {
      setError("Invalid join url");
    }
  }, [groupId, handleJoinGroup, userGroupsLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {error ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <X className="size-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Join Group
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => router.push("/home")}
            variant={"default"}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
