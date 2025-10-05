import { prisma } from "../db";

export async function getAllIncomingSettlementsByGroupMemberId(
  groupMemberId: string,
) {
  return prisma.settlement.findMany({
    where: {
      recipientId: groupMemberId,
    },
  });
}

export async function getAllOutgoingSettlementsByGroupMemberId(
  groupMemberId: string,
) {
  return prisma.settlement.findMany({
    where: {
      payerId: groupMemberId,
    },
  });
}
