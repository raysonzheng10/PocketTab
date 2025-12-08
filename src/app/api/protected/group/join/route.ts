// api/protected/group/join
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { joinUserToGroup } from "@/backend/services/groupMemberServices";
import { getActiveGroupMembersWithGroupsByUserId } from "@/backend/repositories/groupMemberRepo";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user already has 5 active groups
    const activeGroups = await getActiveGroupMembersWithGroupsByUserId(
      authUser.id,
    );
    if (activeGroups.length >= 5) {
      return NextResponse.json(
        {
          error:
            "You are currently in 5 groups, which is the limit. To join another group, leave one of your current groups.",
        },
        { status: 400 },
      );
    }

    const groupMember = await joinUserToGroup(authUser.id, groupId);

    return NextResponse.json({ groupMember });
  } catch (err: unknown) {
    console.error("Error in POST /group/join:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
