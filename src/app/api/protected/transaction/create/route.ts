// api/protected/transaction/create
import { createTransactionWithExpensesAndSettlements } from "@/backend/services/transactionServices";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const { transactionOwnerId, title, amount, splits } = await req.json();

    if (!transactionOwnerId || !title || !amount || !splits) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const transaction = await createTransactionWithExpensesAndSettlements(
      transactionOwnerId,
      title,
      amount,
      splits,
    );
    return NextResponse.json({ transaction: transaction });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
