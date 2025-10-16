import { useState, useEffect, useCallback } from "react";
import type { Group } from "@/types";

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch("/api/protected/group");
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch groups");
      setGroups(data.groups);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unknown error fetching groups",
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, fetchGroups, error, loading };
};
