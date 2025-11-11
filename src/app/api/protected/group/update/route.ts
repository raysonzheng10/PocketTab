// api/protected/group/update
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { updateGroupDetails } from "@/backend/services/groupServices";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const { groupId, newName, newDescription } = await req.json();
    if (!groupId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const updatedGroup = await updateGroupDetails(
      groupId,
      newName,
      newDescription,
    );

    return NextResponse.json({ group: updatedGroup });
  } catch (err: unknown) {
    console.error("Error in POST /group/update:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
