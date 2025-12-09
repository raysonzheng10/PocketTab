import { prisma } from "../db";
import { getGroupIdByGroupMemberId } from "../repositories/groupMemberRepo";
import {
  getActiveRecurringTransactionWithGroupMemberAndRecurringExpensesByGroupIdPaginated,
  getActiveRecurringTransactionsByGroupId,
} from "../repositories/recurringTransactionRepo";

type expense = {
  groupMemberId: string;
  amount: number;
};

export function getNextOccurrence(
  interval: string,
  originalStartDate: Date,
  lastOccurrenceDate: Date,
): Date {
  const next = new Date(lastOccurrenceDate);

  switch (interval) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;

    case "weekly":
      next.setDate(next.getDate() + 7);
      break;

    case "monthly": {
      const originalDay = originalStartDate.getDate();
      const targetMonth = next.getMonth() + 1;
      next.setMonth(targetMonth, originalDay);

      // If month overflowed (e.g., Feb 31 → Mar 2), rollback to end of target month
      if (next.getMonth() !== targetMonth % 12) {
        next.setDate(0);
      }
      break;
    }
  }

  return next;
}

export async function createRecurringTransactionWithRecurringExpenses(
  transactionOwnerId: string, // payer GroupMemberId
  title: string,
  amount: number,
  interval: string,
  startDate: Date,
  recurringExpenses: expense[],
  endDate?: Date,
) {
  const groupId = await getGroupIdByGroupMemberId(transactionOwnerId);
  if (!groupId)
    throw new Error("transactionOwnerId does not link to valid GroupId");

  return prisma.$transaction(async (tx) => {
    const recurringTransaction = await tx.recurringTransaction.create({
      data: {
        groupId,
        groupMemberId: transactionOwnerId,
        title,
        amount,
        interval,
        startDate,
        endDate,
        nextOccurrence: getNextOccurrence(
          interval,
          new Date(startDate),
          new Date(startDate),
        ),
      },
    });

    await Promise.all(
      recurringExpenses.map(async (expense: expense) => {
        // 1. Create expense row
        await tx.recurringExpense.create({
          data: {
            groupMemberId: expense.groupMemberId,
            recurringTransactionId: recurringTransaction.id,
            amount: expense.amount,
          },
        });
      }),
    );

    return recurringTransaction;
  });
}

export async function getActiveDetailedRecurringTransactionsByGroupIdPaginated(
  groupId: string,
  limit: number,
  cursor?: string,
) {
  const { activeRecurringTransactions, nextCursor } =
    await getActiveRecurringTransactionWithGroupMemberAndRecurringExpensesByGroupIdPaginated(
      groupId,
      limit,
      cursor,
    );

  const detailedActiveRecurringTransactions = activeRecurringTransactions.map(
    (t) => ({
      id: t.id,
      createdAt: t.createdAt,
      title: t.title,
      amount: t.amount,
      interval: t.interval,
      startDate: t.startDate,
      endDate: t.endDate,
      nextOccurence: t.nextOccurrence,
      groupMemberId: t.groupMemberId,
      groupMemberNickname: t.groupMember.nickname,
      detailedExpenses: t.recurringExpenses.map((e) => ({
        groupMemberId: e.groupMemberId,
        groupMemberNickname: e.groupMember.nickname,
        amount: e.amount,
      })),
    }),
  );

  return { detailedActiveRecurringTransactions, nextCursor };
}

export async function getActiveRecurringTransactionsByGroupMemberId(
  groupMemberId: string,
) {
  const groupId = await getGroupIdByGroupMemberId(groupMemberId);
  if (!groupId) {
    throw new Error("groupMemberId does not link to valid GroupId");
  }

  return getActiveRecurringTransactionsByGroupId(groupId);
}

export async function deleteRecurringTransactionWithRecurringExpenses(
  recurringTransactionId: string,
): Promise<boolean> {
  await prisma.$transaction(async (tx) => {
    await tx.recurringExpense.deleteMany({
      where: {
        recurringTransactionId,
      },
    });

    await tx.recurringTransaction.delete({
      where: {
        id: recurringTransactionId,
      },
    });
  });

  return true;
}
