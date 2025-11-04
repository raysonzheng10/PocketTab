import { formatAmount, formatDate } from "@/app/utils/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DetailedRecurringTransaction } from "@/types";
import { Separator } from "@/components/ui/separator";

interface TransactionSheetProps {
  selectedTransaction: DetailedRecurringTransaction | null;
  setSelectedTransaction: (t: DetailedRecurringTransaction | null) => void;
}

export default function RecurringTransactionSheet({
  selectedTransaction,
  setSelectedTransaction,
}: TransactionSheetProps) {
  return (
    <Sheet
      open={!!selectedTransaction}
      onOpenChange={() => setSelectedTransaction(null)}
    >
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="px-6">
          <SheetTitle>Recurring Transaction</SheetTitle>
        </SheetHeader>

        {selectedTransaction && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="mt-6 space-y-6">
              {/* Amount Section */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold">
                  {formatAmount(selectedTransaction.amount)}
                </p>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-base">{selectedTransaction.title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interval</p>
                  <p className="text-base capitalize">
                    {selectedTransaction.interval}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Next Occurrence
                  </p>
                  <p className="text-base">
                    {formatDate(selectedTransaction.nextOccurence)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Start Date
                  </p>
                  <p className="text-base">
                    {formatDate(selectedTransaction.startDate)}
                  </p>
                </div>

                {selectedTransaction.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      End Date
                    </p>
                    <p className="text-base">
                      {formatDate(selectedTransaction.endDate)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Paid By</p>
                  <p className="text-base">
                    {selectedTransaction.groupMemberNickname}
                  </p>
                </div>
              </div>

              {/* Expense Breakdown */}
              {selectedTransaction.detailedExpenses.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold mb-3">Split Between</p>
                    <div className="space-y-2">
                      {selectedTransaction.detailedExpenses.map((e) => (
                        <div
                          key={e.groupMemberId}
                          className="flex justify-between py-2"
                        >
                          <span className="text-sm">
                            {e.groupMemberNickname}
                          </span>
                          <span className="text-sm font-medium">
                            {formatAmount(e.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Meta Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Created{" "}
                  {new Date(selectedTransaction.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </p>
                <p className="font-mono">{selectedTransaction.id}</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
