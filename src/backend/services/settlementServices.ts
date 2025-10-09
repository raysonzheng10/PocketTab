import {
  getAllIncomingSettlementsByGroupMemberId,
  getAllOutgoingSettlementsByGroupMemberId,
} from "../repositories/settlementRepo";
import { Decimal } from "@prisma/client/runtime/client";

type MemberSettlement = {
  nickname: string;
  amount: Decimal;
};

type DetailedSettlements = {
  settlements: Record<string, MemberSettlement>;
  total: Decimal;
};

export async function getDetailedSettlementsByGroupMemberId(
  groupMemberId: string,
): Promise<DetailedSettlements> {
  const outgoingSettlements =
    await getAllOutgoingSettlementsByGroupMemberId(groupMemberId);
  const incomingSettlements =
    await getAllIncomingSettlementsByGroupMemberId(groupMemberId);

  const settlements: Record<string, MemberSettlement> = {};

  // Others paid you → positive balance
  for (const { payer, amount } of incomingSettlements) {
    const id = payer.id;
    const nickname = payer.nickname;
    settlements[id] = {
      nickname,
      amount,
    };
  }

  // You owe others → negative balance
  for (const { recipient, amount } of outgoingSettlements) {
    const id = recipient.id;
    const nickname = recipient.nickname;
    const existing = settlements[id];
    settlements[id] = {
      nickname,
      amount: (existing?.amount ?? new Decimal(0)).minus(amount),
    };
  }

  // Compute total sum across all settlements
  const total = Object.values(settlements).reduce(
    (acc, { amount }) => acc.plus(amount),
    new Decimal(0),
  );

  return { settlements, total };
}
