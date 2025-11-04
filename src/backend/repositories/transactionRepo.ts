import { prisma } from "../db";
import { Prisma } from "@prisma/client";

export type TransactionWithGroupMemberAndExpenses =
  Prisma.TransactionGetPayload<{
    include: {
      groupMember: true;
      expenses: {
        include: {
          groupMember: true;
        };
      };
    };
  }>;

export type TransactionWithGroupMember = Prisma.TransactionGetPayload<{
  include: { groupMember: true };
}>;

// get transactions
export async function getTransactionsWithGroupMemberAndExpensesByGroupIdPaginated(
  groupId: string,
  limit: number,
  cursor?: string,
): Promise<{
  transactionsWithGroupMemberAndExpenses: TransactionWithGroupMemberAndExpenses[];
  nextCursor: string | null;
}> {
  const transactionsWithGroupMemberAndExpenses =
    await prisma.transaction.findMany({
      where: { groupId },
      include: {
        groupMember: true,
        expenses: {
          include: {
            groupMember: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor } } : {}), // cursor defined ? add in cursor: {id: cursor} : add in {}
    });

  let nextCursor: string | null = null;

  // grab next cursor if possible
  if (transactionsWithGroupMemberAndExpenses.length > limit) {
    const nextItem = transactionsWithGroupMemberAndExpenses.pop();
    nextCursor = nextItem?.id || null;
  }

  return { transactionsWithGroupMemberAndExpenses, nextCursor };
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
