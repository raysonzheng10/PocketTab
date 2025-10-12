import { prisma } from "../db";

export async function createRecurringExpense(data: {
  groupMemberId: string;
  recurringTransactionId: string;
  amount: number;
}) {
  return prisma.recurringExpense.create({
    data,
  });
}
