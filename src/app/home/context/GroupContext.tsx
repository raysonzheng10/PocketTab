"use client";
import { Group, DetailedGroupMember } from "@/types";
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
  groupId: string;
  groupLoading: boolean;
  updateGroupDetails: (params: {
    groupId: string;
    newName?: string;
    newDescription?: string;
  }) => Promise<boolean>;
  refreshGroup: () => Promise<void>;
  userGroupMemberId: string;
  groupMembers: DetailedGroupMember[];
  updateGroupMemberNickname: (params: {
    groupMemberId: string;
    nickname: string;
  }) => Promise<boolean>;
  removeGroupMemberFromGroup: (params: {
    groupMemberId: string;
  }) => Promise<boolean>;
  error: string;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const groupId = params.groupId as string;

  const { user } = useUser();
  const [userGroupMemberId, setUserGroupMemberId] = useState<string>("");

  const [group, setGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<DetailedGroupMember[]>([]);
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

  const updateGroupDetails = useCallback(
    async ({
      groupId,
      newName,
      newDescription,
    }: {
      groupId: string;
      newName?: string;
      newDescription?: string;
    }) => {
      try {
        const res = await fetch(`/api/protected/group/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId,
            newName,
            newDescription,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(data.error || "Failed to update group details");

        setGroup(data.group);
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error creating transaction",
        );
        return false;
      }
    },
    [],
  );

  useEffect(() => {
    if (!groupId) return;
    fetchGroupWithGroupMembers();
  }, [groupId, fetchGroupWithGroupMembers]);

  const updateGroupMemberNickname = useCallback(
    async ({
      groupMemberId,
      nickname,
    }: {
      groupMemberId: string;
      nickname: string;
    }) => {
      try {
        const res = await fetch(`/api/protected/groupMember/updateNickname`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupMemberId,
            newNickname: nickname,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(
            data.error || "Failed to update groupMember nickname",
          );

        fetchGroupWithGroupMembers();
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error creating transaction",
        );
        return false;
      }
    },
    [fetchGroupWithGroupMembers],
  );

  const removeGroupMemberFromGroup = useCallback(
    async ({ groupMemberId }: { groupMemberId: string }) => {
      try {
        const res = await fetch(`/api/protected/group/leave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupMemberId,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.error)
          throw new Error(
            data.error || "Failed to remove groupMember from group",
          );

        fetchGroupWithGroupMembers();
        setError("");
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error creating transaction",
        );
        return false;
      }
    },
    [fetchGroupWithGroupMembers],
  );

  return (
    <GroupContext.Provider
      value={{
        group,
        groupId,
        groupLoading,
        updateGroupDetails,
        refreshGroup: fetchGroupWithGroupMembers,
        userGroupMemberId,
        groupMembers,
        updateGroupMemberNickname,
        removeGroupMemberFromGroup,
        error,
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
