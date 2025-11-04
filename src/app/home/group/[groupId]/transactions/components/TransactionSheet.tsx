import { formatAmount, formatDate } from "@/app/utils/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DetailedTransaction } from "@/types";
import { Separator } from "@/components/ui/separator";

interface TransactionSheetProps {
  selectedTransaction: DetailedTransaction | null;
  setSelectedTransaction: (t: DetailedTransaction | null) => void;
}

export default function TransactionSheet({
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
          <SheetTitle className="text-2xl font-bold">
            Transaction Details
          </SheetTitle>
        </SheetHeader>

        {selectedTransaction && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              {/* Amount Section */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">
                  {formatAmount(selectedTransaction.amount)}
                </p>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-base">{selectedTransaction.title}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-base">
                    {formatDate(selectedTransaction.date)}
                  </p>
                </div>

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
