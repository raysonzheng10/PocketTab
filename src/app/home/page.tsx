"use client";
// dashboard
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { User, Group } from "@/types";

export default function DashboardContent() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  // ----- fetching user data -----
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/protected/user");
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Failed to fetch user");
        }

        setUser(data.user);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred while fetching user");
      }
    };

    fetchUser();
  }, []);

  // ----- fetching groups that user is in -----
  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch("/api/protected/group", { method: "GET" });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to fetch groups");
      }

      setGroups(data.groups);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred while fetching groups");
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // ----- button logic -----
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/protected/auth/clearToken", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to log out");
      }

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred while logging out");
    }
  };

  const handleMoveToGroupPage = async (groupId: string) => {
    router.push(`/dashboard/group?groupId=${groupId}`);
  };

  const handleCreateNewGroup = async () => {
    try {
      const res = await fetch("/api/protected/group/create", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create group");
      }

      fetchGroups();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred while creating group");
    }
  };

  //TODO: make a loading component
  if (error) return <p className="text-center mt-10">Error: {error}</p>;
  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Welcome, {user?.email ?? "asdf"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Your Groups</h3>
          <button
            onClick={handleCreateNewGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create New Group
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {groups.length > 0 ? (
            groups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleMoveToGroupPage(group.id)}
                className="flex flex-col text-left px-5 py-3 border border-gray-300 rounded-md hover:bg-green-100 cursor-pointer transition-colors duration-200"
              >
                <p>{group.name ?? "No group name yet"}</p>
                <p>{group.id}</p>
              </button>
            ))
          ) : (
            <p className="text-gray-500 italic">No groups yet</p>
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 mt-6"
      >
        Logout
      </button>
    </div>
  );
}
