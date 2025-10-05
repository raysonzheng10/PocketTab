// api/protected/group
import { NextRequest, NextResponse } from "next/server";
import { getGroupsByUserId } from "@/backend/services/groupServices";
import { getAuthenticatedUser } from "@/app/utils/auth";

// gets all groups that the user is in
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const groups = await getGroupsByUserId(authUser.id);

    return NextResponse.json({ groups });
  } catch (err: unknown) {
    console.error("Error in POST /group:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
