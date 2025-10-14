import { useState, useEffect } from "react";
import type { User } from "@/types";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/protected/user");
        const data = await res.json();
        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to fetch user");
        setUser(data.user);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Unknown error fetching user",
        );
      }
    };
    fetchUser();
  }, []);

  return { user, error };
};
