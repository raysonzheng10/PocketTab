// api/cron/recurringTransaction/create
import { getAllDueRecurringTransactionsWithRecurringExpenses } from "@/backend/repositories/recurringTransactionRepo";
import { createTransactionWithExpensesByRecurringTransactionId } from "@/backend/services/transactionServices";
import { NextResponse } from "next/server";

// must be a GET because vercel cron only works with GET requests
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // your recurring logic here
    const dueRecurringTransactions =
      await getAllDueRecurringTransactionsWithRecurringExpenses();

    await Promise.all(
      dueRecurringTransactions.map((transaction) =>
        createTransactionWithExpensesByRecurringTransactionId(transaction.id),
      ),
    );

    return NextResponse.json(
      { processed: dueRecurringTransactions.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
