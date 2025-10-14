import { useRouter } from "next/router";
import { useUser } from "./hooks/useUser";
import { useGroups } from "./hooks/useGroup";
import { GroupList } from "./components/GroupList";
import { ErrorMessage } from "./components/ErrorMessage";

export default function Home() {
  const router = useRouter();
  const { user, error: userError } = useUser();
  const { groups, fetchGroups, error: groupsError } = useGroups();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/protected/auth/clearToken", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to log out");
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleMoveToGroupPage = (groupId: string) =>
    router.push(`/dashboard/group?groupId=${groupId}`);

  const handleCreateNewGroup = async () => {
    try {
      const res = await fetch("/api/protected/group/create", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to create group");
      fetchGroups();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  if (userError) return <ErrorMessage message={userError} />;
  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Welcome, {user.email}
        </h2>

        {groupsError && <ErrorMessage message={groupsError} />}

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Your Groups</h3>
          <button
            onClick={handleCreateNewGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create New Group
          </button>
        </div>

        <GroupList groups={groups} onSelect={handleMoveToGroupPage} />
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
