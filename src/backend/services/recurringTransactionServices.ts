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
      next.setMonth(next.getMonth() + 1);
      break;
    // TODO: implement monthly/other intervals
    // case "yearly":
    //   next.setFullYear(next.getFullYear() + 1);
    //   break;
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
