// api/protected/recurringTransaction/create
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import { createRecurringTransactionWithRecurringExpenses } from "@/backend/services/recurringTransactionServices";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const {
      transactionOwnerId,
      title,
      amount,
      interval,
      startDate,
      endDate,
      splits, // array of { groupMemberId, amount }
    } = await req.json();

    if (
      !transactionOwnerId ||
      !title ||
      !amount ||
      !interval ||
      !startDate ||
      !splits
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const recurringTransaction =
      await createRecurringTransactionWithRecurringExpenses(
        transactionOwnerId,
        title,
        amount,
        interval,
        startDate,
        splits,
        endDate ?? undefined,
      );

    return NextResponse.json({ transaction: recurringTransaction });
  } catch (err: unknown) {
    console.error("Error in POST /recurringTransaction/create:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
