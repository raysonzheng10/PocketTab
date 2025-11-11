// api/protected/user/upsert
import { createUser, getUserById } from "@/backend/repositories/userRepo";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const userId = authUser.id;
    const userEmail = authUser.email;

    if (!userEmail) {
      // ! This should never trigger, we only allow account creation via email
      return NextResponse.json(
        { error: "Authenticated user does not have an email" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await getUserById(userId);
    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const newUser = await createUser({ id: userId, email: userEmail });
    return NextResponse.json({ user: newUser });
  } catch (err: unknown) {
    console.error("Error in POST /user/upsert:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
