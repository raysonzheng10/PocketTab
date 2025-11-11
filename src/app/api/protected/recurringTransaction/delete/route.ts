// api/protected/recurringTransaction/delete
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { deleteRecurringTransactionWithRecurringExpenses } from "@/backend/services/recurringTransactionServices";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const { recurringTransactionId } = await req.json();

    if (!recurringTransactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const success = await deleteRecurringTransactionWithRecurringExpenses(
      recurringTransactionId,
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete recurring transaction" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: success });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
