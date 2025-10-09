import { prisma } from "../db";

export async function getAllIncomingSettlementsByGroupMemberId(
  groupMemberId: string,
) {
  return prisma.settlement.findMany({
    where: {
      recipientId: groupMemberId,
    },
    include: {
      payer: true,
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
    include: { recipient: true },
  });
}
