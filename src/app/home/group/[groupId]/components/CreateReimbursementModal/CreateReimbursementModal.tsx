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
  const { groupMembers } = useGroup();
  const { createReimbursement, createReimbursementLoading } = useTransactions();
  const { settlements } = useSettlements();

  const { setError } = useError();

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [payerId, setPayerId] = useState<string>("");
  const [recipientId, setRecipientId] = useState<string>("");

  const handleCloseModal = () => {
    setTitle("");
    setAmount(0);
    setDate(new Date());
    setPayerId("");
    setRecipientId("");
    onOpenChange(false);
  };

  const handleCreateReimbursement = async () => {
    if (!title) {
      setError("Title cannot be empty");
    } else if (!payerId) {
      setError("Paid By cannot be empty");
    }

    const reimbursementSuccess = await createReimbursement({
      payerId,
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
      <DialogContent className="max-h-2/3 overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Reimbursement</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-8 overflow-hidden">
          <FormField title="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Transaction title"
            />
          </FormField>

          <FormField title="Amount">
            <AmountInput setAmount={setAmount} />
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
                  onSelect={setDate}
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
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
