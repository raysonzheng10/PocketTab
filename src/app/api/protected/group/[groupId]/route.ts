// api/protected/group/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import {
  checkUserIsInGroup,
  getGroupWithGroupMembersByGroupId,
} from "@/backend/services/groupServices";
import { GroupMember } from "@/types";

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
      await getGroupWithGroupMembersByGroupId(groupId);

    const sanitizedGroupMembers: GroupMember[] =
      groupWithGroupMembers.groupMembers.map((m) => ({
        id: m.id,
        createdAt: m.createdAt,
        nickname: m.nickname,
        userId: m.userId,
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
