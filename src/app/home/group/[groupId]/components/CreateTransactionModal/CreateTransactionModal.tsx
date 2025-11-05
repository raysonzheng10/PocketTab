import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useGroup } from "@/app/home/context/GroupContext";
import { Separator } from "@/components/ui/separator";
import SplittingCollapsible from "./SplittingCollapsible";
import { useError } from "@/app/home/context/ErrorContext";
import { ExpenseSplit } from "@/types";
import { useTransactions } from "../../context/TransactionContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OneTimeTransactionContent from "./OneTimeTransactionContent";
import RecurringTransactionContent from "./RecurringTransactionContent";
import { useRecurringTransactions } from "../../context/RecurringTransactionContext";

export interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTransactionModal({
  open,
  onOpenChange,
}: CreateTransactionModalProps) {
  const { groupMembers } = useGroup();
  const { createTransaction, createTransactionLoading } = useTransactions();
  const { createRecurringTransaction, createRecurringTransactionLoading } =
    useRecurringTransactions();
  const { setError } = useError();

  const [transactionType, setTransactionType] = useState<
    "one-time" | "recurring"
  >("one-time");
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [payerId, setPayerId] = useState<string>("");

  // recurring transaction requirements
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [interval, setInterval] = useState<string>("");

  const [isSplitOptionsOpen, setIsSplitOptionsOpen] = useState(false);
  const [expenseSplits, setExpenseSplits] = useState<ExpenseSplit[]>([]);

  const initializeSplits = useCallback(() => {
    if (!groupMembers || groupMembers.length === 0) return;

    const initialSplits = groupMembers.map((member) => ({
      groupMemberId: member.id,
      percentage: 100 / groupMembers.length,
      amount: 0,
    }));

    setExpenseSplits(initialSplits);
  }, [groupMembers]);

  // Call on mount / when groupMembers change
  useEffect(() => {
    initializeSplits();
  }, [groupMembers, initializeSplits]);

  const handleCloseModal = () => {
    setTitle("");
    setAmount(0);
    setDate(new Date());
    setEndDate(undefined);
    setInterval("");
    setPayerId("");
    setIsSplitOptionsOpen(false);
    initializeSplits();
    onOpenChange(false);
  };

  const handleCreateTransaction = async () => {
    // ! this is the only check made on splits adding correctly, will want to add more checks in the future
    const totalPercentage = expenseSplits.reduce(
      (sum, split) => sum + split.percentage,
      0,
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError("Splits must add up to 100%");
      return;
    } else if (!title) {
      setError("Title cannot be empty");
    } else if (!payerId) {
      setError("Paid By cannot be empty");
    } else if (transactionType == "recurring" && !interval) {
      setError("Must select an Interval");
    }

    const transactionSuccess = await createTransaction({
      transactionOwnerId: payerId,
      title,
      amount,
      date,
      splits: expenseSplits,
    });

    if (!transactionSuccess) {
      setError("Failed to create the transaction.");
      return;
    }

    if (transactionType === "recurring") {
      const recurringTransactionSuccess = await createRecurringTransaction({
        transactionOwnerId: payerId,
        title,
        amount,
        interval,
        startDate: date,
        endDate,
        splits: expenseSplits,
      });

      if (!recurringTransactionSuccess) {
        setError(
          "Failed to create recurring transaction but created the first instance.",
        );
      }
    }

    handleCloseModal();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCloseModal();
        }
      }}
    >
      <DialogContent className="max-h-2/3 overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Transaction</DialogTitle>
        </DialogHeader>
        <Tabs
          value={transactionType}
          onValueChange={(v) =>
            setTransactionType(v as "one-time" | "recurring")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="one-time">One-time</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>

          <OneTimeTransactionContent
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            date={date}
            setDate={setDate}
            payerId={payerId}
            setPayerId={setPayerId}
          />
          <RecurringTransactionContent
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            date={date}
            setDate={setDate}
            payerId={payerId}
            setPayerId={setPayerId}
            interval={interval}
            setInterval={setInterval}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Tabs>

        <div className="flex flex-col gap-8 overflow-hidden">
          <Separator />
          <SplittingCollapsible
            open={isSplitOptionsOpen}
            setOpen={setIsSplitOptionsOpen}
            splits={expenseSplits}
            setSplits={setExpenseSplits}
            transactionTotal={amount}
          />

          <Button
            disabled={
              createTransactionLoading || createRecurringTransactionLoading
            }
            loading={
              createTransactionLoading || createRecurringTransactionLoading
            }
            onClick={handleCreateTransaction}
          >
            Create Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
