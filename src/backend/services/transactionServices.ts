import { prisma } from "../db";
import { getGroupIdByGroupMemberId } from "../repositories/groupMemberRepo";
import { Prisma } from "@prisma/client";
import { getRecurringTransactionWithRecurringExpensesById } from "../repositories/recurringTransactionRepo";
import {
  getTransactionsWithGroupMemberByGroupId,
  getTransactionsWithGroupMemberAndExpensesByGroupIdPaginated,
  TransactionWithGroupMember,
} from "../repositories/transactionRepo";
import { getNextOccurrence } from "./recurringTransactionServices";
import { formatDate } from "@/app/utils/utils";

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
  isReimbursement?: boolean, // optional flag
) {
  const transaction = await tx.transaction.create({
    data: {
      groupId,
      groupMemberId: transactionOwnerId,
      title,
      date,
      amount,
      ...(isReimbursement !== undefined && { isReimbursement }),
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

      if (expense.groupMemberId !== transactionOwnerId) {
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
  console.log(
    recurringTransaction,
    formatDate(recurringTransaction.nextOccurrence),
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
          recurringTransaction.startDate,
          newTransaction.date,
        ),
      },
    });

    return newTransaction;
  });
}

export async function createReimbursement(
  reimbursementCreatorId: string,
  recipientId: string,
  amount: number,
  date: Date,
  title: string,
) {
  const groupId = await getGroupIdByGroupMemberId(reimbursementCreatorId);
  if (!groupId) throw new Error("user does not link to valid GroupId");

  // ? Reimbursement - reimbursementcreator pays recipient IRL
  // ? this means that in our app, the recipient owes the reimbursementCreator
  const expenses = [
    {
      groupMemberId: recipientId,
      amount,
    },
  ];

  return prisma.$transaction(async (tx) => {
    return createTransactionWithExpensesAndSettlementsInTx(
      tx,
      reimbursementCreatorId,
      title,
      amount,
      date,
      expenses,
      groupId,
      true, // isReimbursement flag
    );
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
  const { transactionsWithGroupMemberAndExpenses, nextCursor } =
    await getTransactionsWithGroupMemberAndExpensesByGroupIdPaginated(
      groupId,
      limit,
      cursor,
    );

  const detailedTransactions = transactionsWithGroupMemberAndExpenses.map(
    (t) => ({
      id: t.id,
      createdAt: t.createdAt,
      amount: t.amount,
      title: t.title,
      date: t.date,
      isReimbursement: t.isReimbursement,
      groupMemberId: t.groupMemberId,
      groupMemberNickname: t.groupMember.nickname,
      detailedExpenses: t.expenses.map((e) => ({
        groupMemberId: e.groupMemberId,
        groupMemberNickname: e.groupMember.nickname,
        amount: e.amount,
      })),
    }),
  );

  return { detailedTransactions, nextCursor };
}

// Pass in a tx client to perform transaction
export async function deleteTransactionWithExpensesAndUpdateSettlementsInTx(
  tx: Prisma.TransactionClient,
  transactionId: string,
) {
  // fetch the transaction along with its expenses
  const transaction = await tx.transaction.findUnique({
    where: { id: transactionId },
    include: { expenses: true },
  });

  if (!transaction) throw new Error("Transaction not found");

  const transactionOwnerId = transaction.groupMemberId;

  // Reverse settlements for each expense
  await Promise.all(
    transaction.expenses.map(async (expense) => {
      if (expense.groupMemberId !== transactionOwnerId) {
        await tx.settlement.update({
          where: {
            payerId_recipientId: {
              payerId: expense.groupMemberId,
              recipientId: transactionOwnerId,
            },
          },
          // decrement the corresponding settlement
          data: {
            amount: { decrement: expense.amount },
          },
        });
      }
    }),
  );

  // delete all expenses
  await tx.expense.deleteMany({
    where: { transactionId },
  });

  // delete the transaction itself
  await tx.transaction.delete({
    where: { id: transactionId },
  });

  return true;
}

export async function deleteTransactionWithExpensesAndUpdateSettlements(
  transactionId: string,
) {
  return prisma.$transaction(async (tx) => {
    return deleteTransactionWithExpensesAndUpdateSettlementsInTx(
      tx,
      transactionId,
    );
  });
}
