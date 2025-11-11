import { prisma } from "../db";
import { getGroupIdByGroupMemberId } from "../repositories/groupMemberRepo";
import { getActiveRecurringTransactionWithGroupMemberAndRecurringExpensesByGroupIdPaginated } from "../repositories/recurringTransactionRepo";

type expense = {
  groupMemberId: string;
  amount: number;
};

export function getNextOccurrence(interval: string, startDate: Date): Date {
  const next = new Date(startDate); // clone the date

  switch (interval) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      const originalDay = startDate.getDate();
      next.setMonth(next.getMonth() + 1);

      // If we're on the last day of the original month, stay on last day
      const lastDayOfOriginalMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      ).getDate();

      if (originalDay === lastDayOfOriginalMonth) {
        // Set to last day of target month
        const lastDayOfTargetMonth = new Date(
          next.getFullYear(),
          next.getMonth() + 1,
          0,
        ).getDate();
        next.setDate(lastDayOfTargetMonth);
      } else if (next.getDate() !== originalDay) {
        // Overflow occurred (e.g., Jan 31 -> Mar 3), clamp to last day of target month
        next.setDate(0); // Goes back to last day of previous month
      }
      break;
    default:
      throw new Error(`Invalid interval: ${interval}`);
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
        nextOccurrence: getNextOccurrence(interval, startDate),
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
