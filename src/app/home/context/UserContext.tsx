"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User } from "@/types";

// ---- Type ----
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string;
  refreshUser: () => Promise<void>;
}

// ---- Context ----
const UserContext = createContext<UserContextType | undefined>(undefined);

// ---- Provider ----
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/protected/user");
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch user");

      setUser(data.user);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unknown error fetching user",
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        refreshUser: fetchUser,
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
