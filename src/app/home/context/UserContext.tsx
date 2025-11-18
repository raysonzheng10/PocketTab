"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Group, User } from "@/types";
import { usePathname } from "next/navigation";
import { demoUser, demoUserGroups } from "@/app/demo/data/UserContextData";
import { simulateDelay } from "@/app/utils/utils";

// ---- Type ----
interface UserContextType {
  error: string;
  user: User | null;
  userLoading: boolean;
  refreshUser: () => Promise<void>;
  userGroups: Group[];
  userGroupsLoading: boolean;
  refreshUserGroups: () => Promise<void>;
}

// ---- Context ----
const UserContext = createContext<UserContextType | undefined>(undefined);

// ---- Provider ----
export function UserProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDemoMode = pathname?.startsWith("/demo");

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (isDemoMode) {
      setUserLoading(true);
      await simulateDelay(400);
      setUser(demoUser);
      setError("");
      setUserLoading(false);
      return;
    }

    setUserLoading(true);
    try {
      const res = await fetch("/api/protected/user");
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch user");

      setUser(data.user);
      setError("");
    } catch {
      setError("Error fetching user data, refresh to try again");
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [userGroupsLoading, setUserGroupsLoading] = useState<boolean>(true);

  const fetchGroups = useCallback(async () => {
    if (isDemoMode) {
      setUserGroupsLoading(true);
      await simulateDelay(400);
      setUserGroups(demoUserGroups);
      setError("");
      setUserGroupsLoading(false);
      return;
    }

    setUserGroupsLoading(true);
    try {
      const res = await fetch("/api/protected/group");
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch groups");
      setUserGroups(data.groups);
    } catch {
      setError("Error fetching groups, refresh to try again");
    }
    setUserGroupsLoading(false);
  }, [isDemoMode]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <UserContext.Provider
      value={{
        user,
        userLoading,
        error,
        refreshUser: fetchUser,
        userGroups,
        userGroupsLoading,
        refreshUserGroups: fetchGroups,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ---- Hook ----
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
