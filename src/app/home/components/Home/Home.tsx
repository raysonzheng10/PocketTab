"use client";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../../context/UserContext";
import GroupList from "./GroupList";
import { Button } from "@/components/ui/button";
import { useError } from "../../context/ErrorContext";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const router = useRouter();
  const { userGroups, userGroupsLoading, refreshUserGroups } = useUser();
  const { setError } = useError();
  const handleMoveToGroupPage = (groupId: string) =>
    router.push(`/home/group/${groupId}`);

  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);

  const isMaxGroups = userGroups.length >= 5;

  const handleCreateNewGroup = async () => {
    try {
      setIsCreatingGroup(true);
      const res = await fetch("/api/protected/group/create", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to create group");
      refreshUserGroups();
    } catch {
      setError("Failed to create new group.");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Your Groups
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Manage and access your groups
                </p>
              </div>
              <Button
                onClick={handleCreateNewGroup}
                loading={isCreatingGroup}
                disabled={userGroupsLoading || isMaxGroups || isCreatingGroup}
                variant={"default"}
                size={"sm"}
              >
                <Plus className="h-4 w-4" />
                <span>
                  Create <span className="hidden sm:inline">Group</span>
                </span>
              </Button>
            </div>
            {isMaxGroups && (
              <Alert variant="destructive" className="shadow-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can be in at most 5 groups. To add or join another, leave
                  one of your current groups.
                </AlertDescription>
              </Alert>
            )}
            {/* Groups List / Skeleton */}
            {userGroupsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <GroupList groups={userGroups} onSelect={handleMoveToGroupPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
