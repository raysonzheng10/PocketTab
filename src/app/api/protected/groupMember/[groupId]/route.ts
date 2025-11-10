// api/protected/groupMember/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { getDetailedGroupMemberByUserIdAndGroupId } from "@/backend/repositories/groupMemberRepo";
import { DetailedGroupMember } from "@/types";

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

    const groupMember = await getDetailedGroupMemberByUserIdAndGroupId(
      authUser.id,
      groupId,
    );

    if (!groupMember || !groupMember.active) {
      return NextResponse.json(
        { error: "User is not a part of this group" },
        { status: 400 },
      );
    }

    const DetailedGroupMember: DetailedGroupMember = {
      id: groupMember.id,
      createdAt: groupMember.createdAt,
      nickname: groupMember.nickname,
      leftAt: groupMember.leftAt,
      active: groupMember.active,
      userId: groupMember.userId,
      userEmail: groupMember.user.email,
    };

    return NextResponse.json({ groupMember: DetailedGroupMember });
  } catch (err: unknown) {
    console.error("Error in POST /group/[groupId]:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
