// api/protected/transaction/reimbursement/create
import { createReimbursement } from "@/backend/services/transactionServices";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const { reimbursementCreatorId, title, amount, date, recipientId } =
      await req.json();

    if (!reimbursementCreatorId || !title || !amount || !date || !recipientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const transaction = await createReimbursement(
      reimbursementCreatorId,
      recipientId,
      amount,
      date,
      title,
    );

    return NextResponse.json({ transaction: transaction });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
