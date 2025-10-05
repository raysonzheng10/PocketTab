import {
  getAllIncomingSettlementsByGroupMemberId,
  getAllOutgoingSettlementsByGroupMemberId,
} from "../repositories/settlementRepo";
import { Decimal } from "@prisma/client/runtime/client";

export async function getActiveSettlementsByGroupMemberId(
  groupMemberId: string,
): Promise<Record<string, Decimal>> {
  const outgoingSettlements =
    await getAllOutgoingSettlementsByGroupMemberId(groupMemberId);
  const incomingSettlements =
    await getAllIncomingSettlementsByGroupMemberId(groupMemberId);

  const settlements: Record<string, Decimal> = {};

  // Others paid you → positive balance
  for (const { payerId, amount } of incomingSettlements) {
    settlements[payerId] = amount;
  }

  // You owe others → negative balance
  for (const { recipientId, amount } of outgoingSettlements) {
    settlements[recipientId] = (
      settlements[recipientId] ?? new Decimal(0)
    ).minus(amount);
  }

  return settlements;
}
