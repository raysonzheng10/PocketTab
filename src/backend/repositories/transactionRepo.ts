import { prisma } from "../db";
import { Prisma } from "@prisma/client";

export type TransactionWithGroupMember = Prisma.TransactionGetPayload<{
  include: { groupMember: true };
}>;

// get transactions
export async function getTransactionsWithGroupMembersByGroupIdPaginated(
  groupId: string,
  limit: number,
  cursor?: string,
): Promise<{
  transactionsWithGroupMembers: TransactionWithGroupMember[];
  nextCursor: string | null;
}> {
  const transactionsWithGroupMembers = await prisma.transaction.findMany({
    where: { groupId },
    include: { groupMember: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor } } : {}), // cursor defined ? add in cursor: {id: cursor} : add in {}
  });

  let nextCursor: string | null = null;

  // grab next cursor if possible
  if (transactionsWithGroupMembers.length > limit) {
    const nextItem = transactionsWithGroupMembers.pop();
    nextCursor = nextItem?.id || null;
  }

  return { transactionsWithGroupMembers, nextCursor };
}

export async function getTransactionsWithGroupMemberByGroupId(
  groupId: string,
): Promise<TransactionWithGroupMember[]> {
  return prisma.transaction.findMany({
    where: { groupId },
    include: { groupMember: true },
    orderBy: { createdAt: "desc" },
  });
}

// create transactions
export async function createTransaction(data: {
  groupId: string;
  groupMemberId: string;
  title: string;
  amount: number;
}) {
  return prisma.transaction.create({ data });
}
