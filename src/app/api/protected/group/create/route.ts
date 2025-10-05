// api/protected/group/create
import { createNewGroupByUserId } from "@/backend/services/groupServices";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const newGroup = await createNewGroupByUserId(authUser.id);
    return NextResponse.json({ group: newGroup });
  } catch (err: unknown) {
    console.error("Error in POST /group/create:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
