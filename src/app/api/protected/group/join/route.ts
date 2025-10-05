// api/protected/group/join
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { createGroupMember } from "@/backend/repositories/groupMemberRepo";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const body = await req.json();
    const { groupId } = body;

    const newGroupMember = createGroupMember({
      userId: authUser.id,
      groupId,
      nickname: authUser.email ?? "unknown",
    });

    return NextResponse.json({ groupMember: newGroupMember });
  } catch (err: unknown) {
    console.error("Error in POST /group/join:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
