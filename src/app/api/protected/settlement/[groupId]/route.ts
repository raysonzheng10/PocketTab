// api/protected/settlement/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { getGroupMemberByUserIdAndGroupId } from "@/backend/repositories/groupMemberRepo";
import { getActiveSettlementsByGroupMemberId } from "@/backend/services/settlementServices";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
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
    const settlementsDecimal = await getActiveSettlementsByGroupMemberId(
      groupMember.id,
    );

    const settlements: Record<string, number> = Object.fromEntries(
      Object.entries(settlementsDecimal).map(([key, value]) => [
        key,
        value.toNumber(),
      ]),
    );

    return NextResponse.json({ settlements });
  } catch (err: unknown) {
    console.error("Error in POST /settlement/[groupId]:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
