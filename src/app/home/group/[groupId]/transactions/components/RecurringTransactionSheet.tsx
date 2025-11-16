import { formatAmount, formatDate } from "@/app/utils/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DetailedRecurringTransaction } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useError } from "@/app/home/context/ErrorContext";
import { useRecurringTransactions } from "../../context/RecurringTransactionContext";
import { useGroup } from "@/app/home/context/GroupContext";

interface TransactionSheetProps {
  selectedTransaction: DetailedRecurringTransaction | null;
  setSelectedTransaction: (t: DetailedRecurringTransaction | null) => void;
}

export default function RecurringTransactionSheet({
  selectedTransaction,
  setSelectedTransaction,
}: TransactionSheetProps) {
  const { setError } = useError();
  const { userGroupMemberId } = useGroup();
  const { deleteRecurringTransaction } = useRecurringTransactions();

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteRecurringTransaction = async () => {
    if (!selectedTransaction) {
      setError("Invalid transaction, cannot delete");
      return;
    }

    setIsDeleting(true);
    const deleteSuccess = await deleteRecurringTransaction({
      recurringTransactionId: selectedTransaction.id,
    });

    if (!deleteSuccess) {
      setError("Failed to delete transaction");
    }

    setIsDeleting(false);
    closeSheet();
  };

  const closeSheet = () => {
    setSelectedTransaction(null);
    setShowConfirm(false);
    setIsDeleting(false);
  };

  return (
    <Sheet open={!!selectedTransaction} onOpenChange={closeSheet}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-xl font-bold">
            Recurring Transaction Details
          </SheetTitle>
        </SheetHeader>

        {selectedTransaction && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              {/* Amount Section */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">
                  {formatAmount(selectedTransaction.amount)}
                </p>
              </div>

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
                  <p className="truncate text-base">
                    {selectedTransaction.groupMemberNickname}
                    {selectedTransaction.groupMemberId === userGroupMemberId &&
                      " (You)"}
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
                      {selectedTransaction.detailedExpenses
                        .sort((a, b) => {
                          if (a.groupMemberId === userGroupMemberId) return -1;
                          if (b.groupMemberId === userGroupMemberId) return 1;
                          return 0;
                        })
                        .map((e) => (
                          <div
                            key={e.groupMemberId}
                            className="flex justify-between py-2"
                          >
                            <span className="truncate text-sm">
                              {e.groupMemberNickname}
                              {e.groupMemberId === userGroupMemberId &&
                                " (You)"}
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
                <p>Created {formatDate(selectedTransaction.createdAt)}</p>
              </div>

              {/* Delete Button */}
              {!showConfirm ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowConfirm(true)}
                >
                  <Trash2 className="mr-1 size-4" />
                  Delete Reccurment
                </Button>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={isDeleting}
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 overflow-x-hidden"
                      loading={isDeleting}
                      disabled={isDeleting}
                      onClick={handleDeleteRecurringTransaction}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
