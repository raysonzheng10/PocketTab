import { Prisma } from "@prisma/client";
import { prisma } from "../db";

// get groups
export async function getGroupById(id: string) {
  return prisma.group.findUnique({ where: { id } });
}

export async function getGroupWithGroupMembersById(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: { groupMembers: true },
  });
}

// create groups
export async function createGroup(data: {
  name?: string | null;
  description?: string | null;
}) {
  return prisma.group.create({ data });
}

export async function updateGroup(id: string, data: Prisma.GroupUpdateInput) {
  return prisma.group.update({
    where: { id },
    data,
  });
}
