import { formatAmount, formatDate } from "@/app/utils/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DetailedTransaction } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { useError } from "@/app/home/context/ErrorContext";

interface TransactionSheetProps {
  selectedTransaction: DetailedTransaction | null;
  setSelectedTransaction: (t: DetailedTransaction | null) => void;
}

export default function TransactionSheet({
  selectedTransaction,
  setSelectedTransaction,
}: TransactionSheetProps) {
  const { setError } = useError();
  const { deleteTransaction } = useTransactions();

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) {
      setError("Invalid transaction, cannot delete");
      return;
    }

    setIsDeleting(true);
    const deleteSuccess = await deleteTransaction({
      transactionId: selectedTransaction.id,
    });

    if (!deleteSuccess) {
      setError("Failed to delete transaction");
    }

    setIsDeleting(false);
    setSelectedTransaction(null);
  };

  const closeSheet = () => {
    setShowConfirm(false);
    setIsDeleting(false);
    setSelectedTransaction(null);
  };

  return (
    <Sheet open={!!selectedTransaction} onOpenChange={closeSheet}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-xl font-bold">
            Transaction Details
          </SheetTitle>
        </SheetHeader>

        {selectedTransaction && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col gap-4">
              {/* Amount Section */}
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">
                  {formatAmount(selectedTransaction.amount)}
                </p>
              </div>
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
                  <p className="truncate text-base">
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
                          <span className="truncate text-sm">
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
              <div className="text-xs text-muted-foreground">
                <p>
                  Created{" "}
                  {new Date(selectedTransaction.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </p>
              </div>

              {/* Delete Button */}
              {!showConfirm ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowConfirm(true)}
                >
                  <Trash2 className="mr-1 size-4" />
                  Delete Transaction
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
                      onClick={handleDeleteTransaction}
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
