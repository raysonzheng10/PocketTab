import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGroup } from "@/app/home/context/GroupContext";
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
import {
  Calendar as CalendarIcon,
  ChevronsUpDown,
  Check,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DetailedSettlement } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [recipientSettlement, setRecipientSettlement] =
    useState<DetailedSettlement | null>(null);
  const [isSelectRecipientPopoverOpen, setIsSelectRecipientPopoverOpen] =
    useState<boolean>(false);

  // can only reimburse people who the user owes money to
  const debtSettlements = settlements?.filter(({ amount }) => amount < 0) ?? [];

  const handleSelectSettlement = (settlement: DetailedSettlement) => {
    setRecipientSettlement(settlement);
    setAmount(Math.abs(settlement.amount));
    setTitle(`Reimbursement to ${settlement.nickname}`);
  };

  const handleCloseModal = () => {
    setTitle("");
    setAmount(0);
    setDate(new Date());
    setRecipientSettlement(null);
    onOpenChange(false);
  };

  const handleCreateReimbursement = async () => {
    if (!title) {
      setError("Title cannot be empty");
      return;
    } else if (!userGroupMemberId) {
      setError("Invalid user");
      return;
    } else if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    } else if (!recipientSettlement) {
      setError("Please select a recipient");
      return;
    } else if (amount + recipientSettlement.amount > 0.01) {
      setError("Cannot reimburse more than what you owe");
      return;
    }

    const reimbursementSuccess = await createReimbursement({
      reimbursementCreatorId: userGroupMemberId,
      recipientId: recipientSettlement.groupMemberId,
      title,
      amount,
      date,
    });

    if (!reimbursementSuccess) {
      setError("Failed to create the reimbursement.");
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
          <DialogTitle className="text-xl">Record Reimbursement</DialogTitle>
        </DialogHeader>

        {debtSettlements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You dont owe anyone money. Nothing to settle up!
          </div>
        ) : (
          <div className="flex flex-col gap-6 overflow-hidden">
            <FormField title="Select who to reimburse">
              <Popover
                open={isSelectRecipientPopoverOpen}
                onOpenChange={setIsSelectRecipientPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-between font-normal"
                  >
                    <span className="truncate mr-1">
                      {recipientSettlement
                        ? recipientSettlement.nickname
                        : "Select member..."}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandEmpty className="w-full">
                        No member found.
                      </CommandEmpty>
                      <CommandGroup className="w-full">
                        {debtSettlements.map((settlement) => {
                          return (
                            <CommandItem
                              key={settlement.groupMemberId}
                              value={settlement.nickname}
                              onSelect={() => {
                                handleSelectSettlement(settlement);
                                setIsSelectRecipientPopoverOpen(false);
                              }}
                              className="w-full"
                            >
                              <Check
                                className={`size-4 ${recipientSettlement?.groupMemberId !== settlement.groupMemberId && "opacity-0"}`}
                              />
                              <span className="truncate">
                                {settlement.nickname}
                              </span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                ${Math.abs(settlement.amount).toFixed(2)}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>

            {recipientSettlement && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField title="Title">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Reimbursement Title"
                    />
                  </FormField>

                  <FormField title="Amount">
                    <AmountInput amount={amount} setAmount={setAmount} />
                  </FormField>

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
                </div>
                {amount < Math.abs(recipientSettlement.amount) && (
                  <Alert variant="warning">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      {`This is only a partial reimbursement. To fully reimburse, change the amount to $${Math.abs(recipientSettlement.amount).toFixed(2)}`}
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  disabled={createReimbursementLoading || !recipientSettlement}
                  loading={createReimbursementLoading}
                  onClick={handleCreateReimbursement}
                >
                  Create Reimbursement
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
