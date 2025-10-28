// api/protected/transaction/paginated/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { getDetailedTransactionsByGroupIdPaginated } from "@/backend/services/transactionServices";
import { checkUserIsInGroup } from "@/backend/services/groupServices";
import { getAuthenticatedUser } from "@/app/utils/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 400 });
    }

    const groupId = (await context.params).groupId;
    if (!(await checkUserIsInGroup(authUser.id, groupId))) {
      return NextResponse.json(
        { error: "User is not a part of this group" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 10); // max of 10 transactions per page
    const cursor = searchParams.get("cursor") || undefined;

    const { detailedTransactions, nextCursor } =
      await getDetailedTransactionsByGroupIdPaginated(groupId, limit, cursor);

    return NextResponse.json({
      transactions: detailedTransactions,
      nextCursor,
    });
  } catch (err: unknown) {
    console.error("Error in POST /transaction/[groupId]:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
