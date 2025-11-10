// api/protected/transaction/delete
import { deleteTransactionWithExpensesAndUpdateSettlements } from "@/backend/services/transactionServices";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const success =
      await deleteTransactionWithExpensesAndUpdateSettlements(transactionId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete transaction" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
