// api/protected/recurringTransaction/create
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/utils/auth";
import {
  createRecurringTransactionWithRecurringExpenses,
  getActiveRecurringTransactionsByGroupMemberId,
} from "@/backend/services/recurringTransactionServices";

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

    // Check if group already has 10 active recurring transactions
    const activeRecurringTransactions =
      await getActiveRecurringTransactionsByGroupMemberId(transactionOwnerId);

    if (activeRecurringTransactions.length >= 10) {
      return NextResponse.json(
        {
          error:
            "You are limited to 10 recurring transactions per group. To add another, delete one of your existing recurring transactions.",
        },
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
