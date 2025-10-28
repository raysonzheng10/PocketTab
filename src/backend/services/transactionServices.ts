import { prisma } from "../db";
import { getGroupIdByGroupMemberId } from "../repositories/groupMemberRepo";
import { Prisma } from "@prisma/client";
import { getRecurringTransactionWithRecurringExpensesById } from "../repositories/recurringTransactionRepo";
import {
  getTransactionsWithGroupMemberByGroupId,
  getTransactionsWithGroupMemberByGroupIdPaginated,
  TransactionWithGroupMember,
} from "../repositories/transactionRepo";
import { getNextOccurrence } from "./recurringTransactionServices";

type expense = {
  groupMemberId: string;
  amount: number;
};

// Pass in a tx client to perform transaction
async function createTransactionWithExpensesAndSettlementsInTx(
  tx: Prisma.TransactionClient,
  transactionOwnerId: string,
  title: string,
  amount: number,
  date: Date,
  expenses: expense[],
  groupId: string,
) {
  const transaction = await tx.transaction.create({
    data: {
      groupId,
      groupMemberId: transactionOwnerId,
      title,
      date,
      amount,
    },
  });

  await Promise.all(
    expenses.map(async (expense: expense) => {
      await tx.expense.create({
        data: {
          groupMemberId: expense.groupMemberId,
          transactionId: transaction.id,
          amount: expense.amount,
        },
      });

      if (expense.groupMemberId != transactionOwnerId) {
        await tx.settlement.upsert({
          where: {
            payerId_recipientId: {
              payerId: expense.groupMemberId,
              recipientId: transactionOwnerId,
            },
          },
          update: {
            amount: { increment: expense.amount },
          },
          create: {
            payerId: expense.groupMemberId,
            recipientId: transactionOwnerId,
            amount: expense.amount,
          },
        });
      }
    }),
  );

  return transaction;
}

export async function createTransactionWithExpensesByRecurringTransactionId(
  recurringTransactionId: string,
) {
  const recurringTransactionWithRecurringExpenses =
    await getRecurringTransactionWithRecurringExpensesById(
      recurringTransactionId,
    );
  if (!recurringTransactionWithRecurringExpenses) {
    throw new Error("recurringTransactionId is not valid");
  }

  const { recurringExpenses, ...recurringTransaction } =
    recurringTransactionWithRecurringExpenses;

  const groupId = await getGroupIdByGroupMemberId(
    recurringTransaction.groupMemberId,
  );
  if (!groupId)
    throw new Error(
      "transactionOwnerId does not link to valid GroupId, owner of recurring transaction not in group",
    );

  return prisma.$transaction(async (tx) => {
    // Create transaction with expenses and settlements
    const newTransaction =
      await createTransactionWithExpensesAndSettlementsInTx(
        tx,
        recurringTransaction.groupMemberId,
        recurringTransaction.title,
        recurringTransaction.amount.toNumber(),
        recurringTransaction.nextOccurrence,
        recurringExpenses.map((expense) => ({
          groupMemberId: expense.groupMemberId,
          amount: expense.amount.toNumber(),
        })),
        groupId,
      );

    // Update recurring transaction's next occurrence
    await tx.recurringTransaction.update({
      where: { id: recurringTransactionId },
      data: {
        nextOccurrence: getNextOccurrence(
          recurringTransaction.interval,
          newTransaction.date,
        ),
      },
    });

    return newTransaction;
  });
}

export async function createTransactionWithExpensesAndSettlements(
  transactionOwnerId: string,
  title: string,
  amount: number,
  date: Date,
  expenses: expense[],
) {
  const groupId = await getGroupIdByGroupMemberId(transactionOwnerId);
  if (!groupId)
    throw new Error("transactionOwnerId does not link to valid GroupId");

  return prisma.$transaction(async (tx) => {
    return createTransactionWithExpensesAndSettlementsInTx(
      tx,
      transactionOwnerId,
      title,
      amount,
      date,
      expenses,
      groupId,
    );
  });
}

export async function getTransactionsByGroupMemberId(
  groupMemberId: string,
): Promise<TransactionWithGroupMember[]> {
  const groupId = await getGroupIdByGroupMemberId(groupMemberId);

  if (!groupId) throw new Error("Invalid groupMemberId, no matching groupId");

  const transactions = await getTransactionsWithGroupMemberByGroupId(groupId);
  return transactions;
}

export async function getDetailedTransactionsByGroupIdPaginated(
  groupId: string,
  limit: number,
  cursor?: string,
) {
  const { transactionsWithGroupMember, nextCursor } =
    await getTransactionsWithGroupMemberByGroupIdPaginated(
      groupId,
      limit,
      cursor,
    );

  const detailedTransactions = transactionsWithGroupMember.map((t) => ({
    id: t.id,
    createdAt: t.createdAt,
    amount: t.amount,
    title: t.title,
    date: t.date,
    groupMemberId: t.groupMemberId,
    groupMemberNickname: t.groupMember.nickname,
  }));

  return { detailedTransactions, nextCursor };
}
