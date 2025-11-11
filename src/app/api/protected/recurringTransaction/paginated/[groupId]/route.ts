// api/protected/recurringTransaction/paginated/[groupId]
import { NextRequest, NextResponse } from "next/server";
import { checkUserIsInGroup } from "@/backend/services/groupServices";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { getActiveDetailedRecurringTransactionsByGroupIdPaginated } from "@/backend/services/recurringTransactionServices";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ groupId: string }> },
) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const groupId = (await context.params).groupId;
    if (!(await checkUserIsInGroup(authUser.id, groupId))) {
      return NextResponse.json(
        { error: "User is not a part of this group" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 10); // ? pagination should be unused right now
    const cursor = searchParams.get("cursor") || undefined;

    const { detailedActiveRecurringTransactions, nextCursor } =
      await getActiveDetailedRecurringTransactionsByGroupIdPaginated(
        groupId,
        limit,
        cursor,
      );

    return NextResponse.json({
      recurringTransactions: detailedActiveRecurringTransactions,
      cursor: nextCursor,
    });
  } catch (err: unknown) {
    console.error("Error in POST /transaction/[groupId]:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
