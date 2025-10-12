import { prisma } from "../db";
import { Prisma } from "@prisma/client";

// get recurring transactions with their respective expenses
export async function getAllDueRecurringTransactionsWithRecurringExpenses() {
  const now = new Date();

  return prisma.recurringTransaction.findMany({
    where: {
      nextOccurrence: { lte: now },
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
