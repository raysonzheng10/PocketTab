"use client";
// dashboard
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { User } from "./types";
import { Group } from "./group/types";

export default function DashboardContent() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinGroupId, setJoinGroupId] = useState<string>("");

  // ----- fetching user data -----
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/protected/user");
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  // ----- fetching groups that user is in -----
  const fetchGroups = useCallback(async () => {
    const res = await fetch("/api/protected/group", {
      method: "GET",
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      setGroups(data.groups);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // ----- button logic -----
  const handleLogout = async () => {
    await fetch("api/protected/auth/clearToken", {
      method: "POST",
    });
    router.push("/");
  };

  const handleMoveToGroupPage = async (groupId: string) => {
    router.push(`/dashboard/group?groupId=${groupId}`);
  };

  const handleCreateNewGroup = async () => {
    await fetch("api/protected/group/create", {
      method: "POST",
    });

    fetchGroups(); // reload state
  };

  const handleJoinGroup = async () => {
    await fetch("api/protected/group/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId: joinGroupId,
      }),
    });

    fetchGroups();
    setJoinGroupId("");
  };

  //TODO: make a loading component
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

        <div className="flex items-center justify-between mb-3 gap-4">
          <input
            placeholder="Enter groupID"
            value={joinGroupId}
            onChange={(e) => setJoinGroupId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleJoinGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Join
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
