import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { useGroup } from "@/app/home/context/GroupContext";
import { Separator } from "@/components/ui/separator";
import SplittingCollapsible from "./SplittingCollapsible";
import { ExpenseSplit } from "@/types/expense";
import { useError } from "@/app/home/context/ErrorContext";

export interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTransactionModal({
  open,
  onOpenChange,
}: CreateTransactionModalProps) {
  const { groupMembers, createTransaction, createTransactionLoading } =
    useGroup();
  const { setError } = useError();

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [payerId, setPayerId] = useState<string>("");
  const [isPayerPopoverOpen, setIsPayerPopoverOpen] = useState(false);
  const [isSplitOptionsOpen, setIsSplitOptionsOpen] = useState(false);
  const [expenseSplits, setExpenseSplits] = useState<
    Record<string, ExpenseSplit>
  >({});

  const initializeSplits = useCallback(() => {
    if (!groupMembers || groupMembers.length === 0) return;

    const initialSplits = Object.fromEntries(
      groupMembers.map((member) => [
        member.id,
        { percentage: 100 / groupMembers.length, amount: 0 },
      ]),
    );

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
    setPayerId("");
    setIsPayerPopoverOpen(false);
    setIsSplitOptionsOpen(false);
    initializeSplits();
    onOpenChange(false);
  };

  const handleCreateTransaction = async () => {
    const totalPercentage = Object.values(expenseSplits).reduce(
      (sum, split) => sum + split.percentage,
      0,
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      setError("Splits must add up to 100%");
      return;
    }

    const success = await createTransaction({
      transactionOwnerId: payerId,
      title,
      amount,
      splits: expenseSplits,
    });

    if (success) {
      handleCloseModal();
    }
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
          <DialogTitle className="text-xl">Create Transaction</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <FormField title="Paid By">
              <Popover
                open={isPayerPopoverOpen}
                onOpenChange={setIsPayerPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-between font-normal"
                  >
                    <span className="truncate mr-1">
                      {payerId
                        ? groupMembers?.find((member) => member.id === payerId)
                            ?.nickname
                        : "Select member..."}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    {/* Only show search bar if there are more than 3 groupmembers */}
                    {groupMembers.length > 3 && (
                      <CommandInput
                        placeholder="Search member..."
                        className="w-full"
                      />
                    )}

                    <CommandList>
                      <CommandEmpty className="w-full">
                        No member found.
                      </CommandEmpty>
                      <CommandGroup className="w-full">
                        {groupMembers?.map((member) => (
                          <CommandItem
                            key={member.id}
                            value={member.nickname}
                            onSelect={() => {
                              setPayerId(member.id);
                              setIsPayerPopoverOpen(false);
                            }}
                            className="w-full"
                          >
                            <Check
                              className={`size-4 ${payerId != member.id && "opacity-0"}`}
                            />
                            <span className="truncate">{member.nickname}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>
          </div>

          {/* DEBUG */}
          {/* <div className="flex flex-col">
            <div>DEBUG</div>
            <div>transaction title: {title}</div>
            <div>amount: {amount}</div>
            <div>date: {date.toLocaleDateString()}</div>
            <div>payerId: {payerId}</div>
          </div> */}

          <Separator />
          <SplittingCollapsible
            open={isSplitOptionsOpen}
            setOpen={setIsSplitOptionsOpen}
            splits={expenseSplits}
            setSplits={setExpenseSplits}
            transactionTotal={amount}
          />

          <Button
            disabled={createTransactionLoading}
            onClick={handleCreateTransaction}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">{title}</div>
      {children}
    </div>
  );
}

function AmountInput({ setAmount }: { setAmount: (amount: number) => void }) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (input: string) => {
    const cleaned = input.replace(/[^\d.]/g, ""); // remove bad chars
    const parts = cleaned.split(".");
    let result = parts[0];

    if (parts.length > 1) {
      // Take only first 2 digits after decimal
      result += "." + parts[1].substring(0, 2);
    }

    setInputValue(result);
  };

  const handleBlur = () => {
    // when the user clicks off, we fix the inputValueString to look nice

    // if empty, just reset
    if (inputValue === "" || inputValue === ".") {
      setAmount(0);
      setInputValue("");
      return;
    }

    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      setAmount(0);
      setInputValue("");
    } else {
      setAmount(parsed);
      setInputValue(parsed.toFixed(2));
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 translate-y-1/4">$</span>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="0.00"
        className="pl-6"
      />
    </div>
  );
}
