import {
  getAllIncomingSettlementsByGroupMemberId,
  getAllOutgoingSettlementsByGroupMemberId,
} from "../repositories/settlementRepo";
import { Decimal } from "@prisma/client/runtime/client";

type MemberSettlement = {
  nickname: string;
  amount: Decimal;
};

export async function getDetailedSettlementsByGroupMemberId(
  groupMemberId: string,
) {
  const outgoingSettlements =
    await getAllOutgoingSettlementsByGroupMemberId(groupMemberId);
  const incomingSettlements =
    await getAllIncomingSettlementsByGroupMemberId(groupMemberId);

  const settlementsMap: Record<string, MemberSettlement> = {};

  // Others paid you → positive balance
  for (const { payer, amount } of incomingSettlements) {
    const id = payer.id;
    const nickname = payer.nickname;
    settlementsMap[id] = {
      nickname,
      amount,
    };
  }

  // You owe others → negative balance
  for (const { recipient, amount } of outgoingSettlements) {
    const id = recipient.id;
    const nickname = recipient.nickname;
    const existing = settlementsMap[id];
    settlementsMap[id] = {
      nickname,
      amount: (existing?.amount ?? new Decimal(0)).minus(amount),
    };
  }

  // Convert to array with id included
  const settlements = Object.entries(settlementsMap).map(
    ([id, { nickname, amount }]) => ({
      id,
      nickname,
      amount,
    }),
  );

  return settlements;
}
