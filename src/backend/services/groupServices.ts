import { Group } from "@/types";
import { prisma } from "../db";
import {
  getGroupMemberByUserIdAndGroupId,
  getGroupMembersWithGroupsByUserId,
  getGroupMembersByGroupId,
} from "../repositories/groupMemberRepo";
import { getGroupById } from "../repositories/groupRepo";
import { getUserById } from "../repositories/userRepo";

export async function getGroupWithGroupMembersByGroupId(groupId: string) {
  const group = await getGroupById(groupId);
  const groupMembers = await getGroupMembersByGroupId(groupId);

  return { group: group, groupMembers: groupMembers };
}

export async function getGroupsByUserId(userId: string) {
  const groupMembersWithGroups =
    await getGroupMembersWithGroupsByUserId(userId);

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
