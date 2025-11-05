import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGroup } from "@/app/home/context/GroupContext";
import { Separator } from "@/components/ui/separator";
import { useError } from "@/app/home/context/ErrorContext";
import { useTransactions } from "../../context/TransactionContext";
import { useSettlements } from "../../context/SettlementContext";
import FormField from "../CreateTransactionModal/FormField";
import { Input } from "@/components/ui/input";
import AmountInput from "../CreateTransactionModal/AmountInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export interface CreateReimbursementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateReimbursementModal({
  open,
  onOpenChange,
}: CreateReimbursementModalProps) {
  const { userGroupMemberId } = useGroup();
  const { createReimbursement, createReimbursementLoading } = useTransactions();
  const { settlements } = useSettlements();

  const { setError } = useError();

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [recipientId, setRecipientId] = useState<string>("");
  const [isSelectRecipientPopoverOpen, setIsSelectRecipientPopoverOpen] =
    useState<boolean>(false);

  const debtSettlements = settlements?.filter(({ amount }) => amount < 0) ?? [];

  console.log("debt", debtSettlements);
  const handleCloseModal = () => {
    setTitle("");
    setAmount(0);
    setDate(new Date());
    setRecipientId("");
    onOpenChange(false);
  };

  const handleCreateReimbursement = async () => {
    if (!title) {
      setError("Title cannot be empty");
    } else if (!userGroupMemberId) {
      setError("Invalid user");
    } else if (amount <= 0) {
      setError("Amount must be greater than 0");
    }

    const reimbursementSuccess = await createReimbursement({
      payerId: userGroupMemberId,
      recipientId,
      title,
      amount,
      date,
    });

    if (!reimbursementSuccess) {
      setError("Failed to create the transaction.");
      return;
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
      <DialogContent className="max-h-2/3 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Settle Up</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 overflow-hidden">
          {/* <FormField title="Who are you settling up with?">
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a person" />
              </SelectTrigger>
              <SelectContent>
                {otherMembers.map((member) => {
                  const settlement = settlements?.settlements?.[member.id];
                  const balance = settlement?.amount || 0;
                  const balanceText =
                    balance !== 0
                      ? ` (${balance > 0 ? `owes you $${balance.toFixed(2)}` : `you owe $${Math.abs(balance).toFixed(2)}`})`
                      : "";

                  return (
                    <SelectItem key={member.id} value={member.id}>
                      {member.nickname}
                      {balanceText && (
                        <span className="text-xs text-muted-foreground ml-1">
                          {balanceText}
                        </span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormField> */}

          <FormField title="Amount">
            <AmountInput setAmount={setAmount} />
          </FormField>

          <FormField title="Description (optional)">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Venmo payment, cash"
            />
          </FormField>

          <Separator />

          <FormField title="Date">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 max-w-[min(400px,calc(100vw-2rem))]">
                <Calendar
                  mode="single"
                  required={true}
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  className="scale-90 sm:scale-100"
                />
              </PopoverContent>
            </Popover>
          </FormField>

          <Button
            disabled={createReimbursementLoading}
            loading={createReimbursementLoading}
            onClick={handleCreateReimbursement}
          >
            Settle Up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
