import { prisma } from "../db";
import { getGroupIdByGroupMemberId } from "../repositories/groupMemberRepo";
import {
  getTransactionsWithGroupMemberByGroupId,
  TransactionWithGroupMember,
} from "../repositories/transactionRepo";

type expense = {
  groupMemberId: string;
  amount: number;
};

export async function createTransactionWithExpenses(
  payerId: string,
  title: string,
  amount: number,
  expenses: expense[],
) {
  //? Note payerId is a groupMemberID
  const groupId = await getGroupIdByGroupMemberId(payerId);

  if (!groupId) throw new Error("PayerId does not link to valid GroupId");

  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        groupId,
        groupMemberId: payerId,
        title,
        amount,
      },
    });

    await Promise.all(
      expenses.map((expense: expense) => {
        return tx.expense.create({
          data: {
            groupMemberId: expense.groupMemberId,
            transactionId: transaction.id,
            amount: expense.amount,
          },
        });
      }),
    );

    return transaction;
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

export async function getDetailedTransactionsByGroupId(groupId: string) {
  const transactionsWithGroupMember =
    await getTransactionsWithGroupMemberByGroupId(groupId);

  const detailedTransactions = transactionsWithGroupMember.map((t) => ({
    id: t.id,
    createdAt: t.createdAt,
    amount: t.amount,
    title: t.title,
    groupMemberId: t.groupMemberId,
    groupMemberNickname: t.groupMember.nickname,
  }));

  return detailedTransactions;
}
