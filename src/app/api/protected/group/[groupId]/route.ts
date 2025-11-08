// api/protected/group/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import {
  checkUserIsInGroup,
  getGroupWithDetailedGroupMembersByGroupId,
} from "@/backend/services/groupServices";
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
    if (!(await checkUserIsInGroup(authUser.id, groupId))) {
      return NextResponse.json(
        { error: "User is not a part of this group" },
        { status: 400 },
      );
    }

    const groupWithGroupMembers =
      await getGroupWithDetailedGroupMembersByGroupId(groupId);

    const sanitizedGroupMembers: DetailedGroupMember[] =
      groupWithGroupMembers.groupMembers.map((m) => ({
        id: m.id,
        createdAt: m.createdAt,
        nickname: m.nickname,
        leftAt: m.leftAt,
        active: m.active,
        userId: m.userId,
        userEmail: m.user.email,
      }));

    return NextResponse.json({
      group: groupWithGroupMembers.group,
      groupMembers: sanitizedGroupMembers,
    });
  } catch (err: unknown) {
    console.error("Error in POST /group/[groupId]:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
