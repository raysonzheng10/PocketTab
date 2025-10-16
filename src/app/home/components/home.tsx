"use client";
import { useRouter } from "next/navigation";
import { useGroups } from "../hooks/useGroup";
import { GroupList } from "./GroupList";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();
  const { groups, fetchGroups, loading: groupsLoading } = useGroups();

  // const handleLogout = async () => {
  //   try {
  //     const res = await fetch("/api/protected/auth/clearToken", {
  //       method: "POST",
  //     });
  //     if (!res.ok) throw new Error("Failed to log out");
  //     router.push("/");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleMoveToGroupPage = (groupId: string) =>
    router.push(`/home/group/${groupId}`);

  const handleCreateNewGroup = async () => {
    try {
      const res = await fetch("/api/protected/group/create", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to create group");
      fetchGroups();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Groups
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and access your groups
                </p>
              </div>
              <button
                onClick={handleCreateNewGroup}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <Plus className="h-4 w-4" />
                Create Group
              </button>
            </div>

            {/* Groups List / Skeleton */}
            {groupsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <GroupList groups={groups} onSelect={handleMoveToGroupPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
