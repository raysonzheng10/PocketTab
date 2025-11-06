"use client";
import { Group, GroupMember } from "@/types";
import { useParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";

type GroupContextType = {
  group: Group | null;
  error: string;
  groupMembers: GroupMember[];
  groupLoading: boolean;
  refreshGroup: () => Promise<void>;
  groupId: string;
  userGroupMemberId: string;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const groupId = params.groupId as string;

  const { user } = useUser();
  const [userGroupMemberId, setUserGroupMemberId] = useState<string>("");

  const [group, setGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [error, setError] = useState("");
  const [groupLoading, setGroupLoading] = useState(true);

  useEffect(() => {
    if (!user || !groupMembers.length) return;
    const matchedMember = groupMembers.find(
      (member) => member.userId === user.id,
    );
    setUserGroupMemberId(matchedMember ? matchedMember.id : "");
  }, [user, groupMembers]);

  const fetchGroupWithGroupMembers = useCallback(async () => {
    setGroupLoading(true);
    try {
      const res = await fetch(`/api/protected/group/${groupId}`, {
        method: "GET",
      });
      const data = await res.json();

      if (!res.ok || data.error)
        throw new Error(data.error || "Failed to fetch group data/members");

      setGroup(data.group);
      setGroupMembers(data.groupMembers);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unknown error fetching group",
      );
      setGroup(null);
      setGroupMembers([]);
    } finally {
      setGroupLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    fetchGroupWithGroupMembers();
  }, [groupId, fetchGroupWithGroupMembers]);

  return (
    <GroupContext.Provider
      value={{
        group,
        groupMembers,
        groupLoading,
        error,
        refreshGroup: fetchGroupWithGroupMembers,
        groupId,
        userGroupMemberId,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used within GroupProvider");
  return context;
}
