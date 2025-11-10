import { Group } from "@/types";
import { prisma } from "../db";
import {
  getDetailedGroupMembersByGroupId,
  getGroupMemberByUserIdAndGroupId,
  getActiveGroupMembersWithGroupsByUserId,
} from "../repositories/groupMemberRepo";
import { getGroupById, updateGroup } from "../repositories/groupRepo";
import { getUserById } from "../repositories/userRepo";

export async function getGroupWithDetailedGroupMembersByGroupId(
  groupId: string,
) {
  const group = await getGroupById(groupId);
  const groupMembers = await getDetailedGroupMembersByGroupId(groupId);

  return { group: group, groupMembers: groupMembers };
}

export async function getActiveGroupsByUserId(userId: string) {
  const groupMembersWithGroups =
    await getActiveGroupMembersWithGroupsByUserId(userId);

  const groups: Group[] = groupMembersWithGroups.map(
    (groupMemberWithGroup) => groupMemberWithGroup.group,
  );

  return groups;
}

export async function checkUserIsInGroup(userId: string, groupId: string) {
  const groupMember = await getGroupMemberByUserIdAndGroupId(userId, groupId);
  return groupMember != null;
}

export async function createNewGroupByUserId(userId: string) {
  const user = await getUserById(userId);

  if (!user) throw new Error("User not found");

  return prisma.$transaction(async (tx) => {
    const newGroup = await tx.group.create({
      data: {
        name: "New Group",
        description: "Your New Group!",
      },
    });
    await tx.groupMember.create({
      data: {
        userId: userId,
        groupId: newGroup.id,
        nickname: user.email,
      },
    });

    return newGroup;
  });
}

export async function updateGroupDetails(
  groupId: string,
  newName?: string,
  newDescription?: string,
) {
  if (newName === undefined && newDescription === undefined) {
    throw new Error("Invalid parameters for updating group details");
  }

  const updatedGroup = await updateGroup(groupId, {
    ...(newName && { name: newName }),
    ...(newDescription && { description: newDescription }),
  });

  return updatedGroup;
}
