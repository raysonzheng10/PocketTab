import { NextRequest, NextResponse } from "next/server";
import { getDetailedTransactionsByGroupId } from "@/backend/services/transactionServices";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  try {
    await getAuthenticatedUser(req);
    const groupId = (await context.params).groupId;

    const detailedTransactions =
      await getDetailedTransactionsByGroupId(groupId);

    return NextResponse.json({ transactions: detailedTransactions });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
