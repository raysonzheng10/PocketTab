// api/protected/group/leave
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { updateGroupMemberActiveStatus } from "@/backend/services/groupMemberServices";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const { groupMemberId } = await req.json();
    if (!groupMemberId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const updatedGroupMember = await updateGroupMemberActiveStatus(
      groupMemberId,
      false,
    );

    return NextResponse.json({ groupMember: updatedGroupMember });
  } catch (err: unknown) {
    console.error("Error in POST /group/leave:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
