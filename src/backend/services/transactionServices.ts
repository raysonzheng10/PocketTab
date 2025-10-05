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

export async function createTransactionWithExpensesAndSettlements(
  transactionOwnerId: string, // payer GroupMemberId
  title: string,
  amount: number,
  expenses: expense[],
) {
  const groupId = await getGroupIdByGroupMemberId(transactionOwnerId);
  if (!groupId)
    throw new Error("transactionOwnerId does not link to valid GroupId");

  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        groupId,
        groupMemberId: transactionOwnerId,
        title,
        amount,
      },
    });

    await Promise.all(
      expenses.map(async (expense: expense) => {
        // 1. Create expense row
        await tx.expense.create({
          data: {
            groupMemberId: expense.groupMemberId,
            transactionId: transaction.id,
            amount: expense.amount,
          },
        });

        // 2. Upsert settlement
        // Person in `expense.groupMemberId` owes `transactionOwnerId`
        // ! we make an expense for the payer themselves to track share of transaction
        // ! however, doesn't make sense to make settlement of self debt
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
