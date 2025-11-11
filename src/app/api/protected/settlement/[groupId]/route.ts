// api/protected/settlement/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { getGroupMemberByUserIdAndGroupId } from "@/backend/repositories/groupMemberRepo";
import { getDetailedSettlementsByGroupMemberId } from "@/backend/services/settlementServices";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }
    const groupId = (await context.params).groupId;

    const groupMember = await getGroupMemberByUserIdAndGroupId(
      authUser.id,
      groupId,
    );

    if (!groupMember) {
      return NextResponse.json(
        { error: "User is not a part of this group" },
        { status: 400 },
      );
    }

    const detailedSettlements = await getDetailedSettlementsByGroupMemberId(
      groupMember.id,
    );

    // Convert all Decimal values to numbers for JSON
    const settlements = detailedSettlements.map(
      ({ groupMemberId, nickname, amount }) => ({
        groupMemberId,
        nickname,
        amount: amount.toNumber(),
      }),
    );

    const total = settlements.reduce((acc, { amount }) => acc + amount, 0);

    return NextResponse.json({ settlements, total });
  } catch (err: unknown) {
    console.error("Error in POST /settlement/[groupId]:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
