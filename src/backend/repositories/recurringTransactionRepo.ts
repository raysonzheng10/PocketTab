import { prisma } from "../db";
import { Prisma } from "@prisma/client";

// get recurring transactions with their respective expenses
export async function getAllDueRecurringTransactionsWithRecurringExpenses() {
  const nowPlusOneDay = new Date();
  nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1);

  return prisma.recurringTransaction.findMany({
    where: {
      AND: [
        { nextOccurrence: { lte: nowPlusOneDay } },
        {
          OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
      ],
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

export async function getActiveRecurringTransactionWithGroupMemberAndRecurringExpensesByGroupIdPaginated(
  groupId: string,
  limit: number,
  cursor?: string,
) {
  const recurringTransactionsWithGroupMemberAndRecurringExpenses =
    await prisma.recurringTransaction.findMany({
      where: {
        groupId,
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }], // only grabbing active Recurring Transactions
      },
      include: {
        groupMember: true,
        recurringExpenses: {
          include: {
            groupMember: true,
          },
        },
      },
      orderBy: { nextOccurrence: "asc" }, // order by soonest reoccurence -> latest
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor } } : {}),
    });

  const activeRecurringTransactions =
    recurringTransactionsWithGroupMemberAndRecurringExpenses.filter(
      (rt) => rt.endDate === null || rt.endDate >= rt.nextOccurrence,
    );

  let nextCursor: string | null = null;
  // grab next cursor if possible
  if (activeRecurringTransactions.length > limit) {
    const nextItem = activeRecurringTransactions.pop();
    nextCursor = nextItem?.id || null;
  }

  return {
    activeRecurringTransactions,
    nextCursor,
  };
}
