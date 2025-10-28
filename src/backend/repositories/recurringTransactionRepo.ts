import { prisma } from "../db";
import { Prisma } from "@prisma/client";

// get recurring transactions with their respective expenses
export async function getAllDueRecurringTransactionsWithRecurringExpenses() {
  const now = new Date();

  return prisma.recurringTransaction.findMany({
    where: {
      nextOccurrence: { lte: now },
    },
  });
}

export async function getRecurringTransactionWithRecurringExpensesById(
  id: string,
) {
  return prisma.recurringTransaction.findUnique({
    where: {
      id,
    },
    include: {
      recurringExpenses: true,
    },
  });
}

export async function createRecurringTransaction(
  data: Prisma.RecurringTransactionCreateWithoutRecurringExpensesInput,
) {
  return prisma.recurringTransaction.create({
    data,
  });
}

export async function updateRecurringTransaction(
  id: string,
  data: Prisma.RecurringTransactionUpdateWithoutRecurringExpensesInput,
) {
  return prisma.recurringTransaction.update({
    where: { id },
    data,
  });
}

export async function getRecurringTransactionWithGroupMemberByGroupIdPaginated(
  groupId: string,
  limit: number,
  cursor?: string,
) {
  const recurringTransactionsWithGroupMember =
    await prisma.recurringTransaction.findMany({
      where: { groupId },
      include: { groupMember: true },
      orderBy: { nextOccurrence: "asc" }, // order by soonest reoccurence -> latest
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });

  let nextCursor: string | null = null;
  // grab next cursor if possible
  if (recurringTransactionsWithGroupMember.length > limit) {
    const nextItem = recurringTransactionsWithGroupMember.pop();
    nextCursor = nextItem?.id || null;
  }

  return { recurringTransactionsWithGroupMember, nextCursor };
}
