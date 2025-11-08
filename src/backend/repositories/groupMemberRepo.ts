import { Prisma } from "@prisma/client";
import { prisma } from "../db";

// get groupMembers
export async function getGroupMemberById(id: string) {
  return prisma.groupMember.findUnique({ where: { id } });
}

export async function getGroupMemberByUserIdAndGroupId(
  userId: string,
  groupId: string,
) {
  return prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });
}

export async function getGroupMembersByUserId(userId: string) {
  return prisma.groupMember.findMany({ where: { userId } });
}

export async function getDetailedGroupMembersByGroupId(groupId: string) {
  return prisma.groupMember.findMany({
    where: { groupId },
    include: { user: true },
  });
}

export async function getGroupMembersWithGroupsByUserId(userId: string) {
  return prisma.groupMember.findMany({
    where: { userId },
    include: { group: true },
  });
}

export async function getGroupIdByGroupMemberId(groupMemberId: string) {
  const result = await prisma.groupMember.findUnique({
    where: { id: groupMemberId },
    select: { groupId: true },
  });
  return result?.groupId ?? null;
}

// create groupMembers
export async function createGroupMember(data: {
  userId: string;
  groupId: string;
  nickname: string;
}) {
  return prisma.groupMember.create({ data });
}

export async function updateGroupMember(
  id: string,
  data: Prisma.GroupMemberUpdateInput,
) {
  return prisma.groupMember.update({
    where: { id },
    data,
  });
}
