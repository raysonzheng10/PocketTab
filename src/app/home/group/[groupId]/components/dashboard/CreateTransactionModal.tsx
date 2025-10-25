import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTransactionModal({
  open,
  onOpenChange,
}: CreateTransactionModalProps) {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [splitOpen, setSplitOpen] = useState(false);

  // Mock members for now
  const members = ["Alice", "Bob", "Charlie"];
  const [splits, setSplits] = useState<Record<string, number>>(
    Object.fromEntries(members.map((m) => [m, 100 / members.length])),
  );

  const handleSplitChange = (member: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSplits((prev) => ({ ...prev, [member]: numValue }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-3/4 max-w-3/4 transition-all overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Title</div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Transaction title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Date</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <AmountInput value={amount} onChange={setAmount} />
          </div>

          <Collapsible
            open={splitOpen}
            onOpenChange={setSplitOpen}
            className="transition-all duration-300 ease-in-out"
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
              Split Options
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${splitOpen ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 transition-all duration-300 ease-in-out">
              <div className="grid gap-3">
                {members.map((member) => (
                  <div key={member} className="flex items-center gap-2">
                    <label className="text-sm flex-1">{member}</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={splits[member]}
                      onChange={(e) =>
                        handleSplitChange(member, e.target.value)
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AmountInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const parseAmountValue = (value: string) => {
    // Remove $ symbol
    const cleaned = value.replace("$", "");

    // Check if there's a decimal point
    const decimalIndex = cleaned.indexOf(".");

    if (decimalIndex === -1) {
      // No decimal, parse normally and ensure .00
      const val = parseFloat(cleaned) || 0;
      onChange(parseFloat(val.toFixed(2)));
    } else {
      // Has decimal, restrict to 2 digits after decimal
      const beforeDecimal = cleaned.substring(0, decimalIndex);
      const afterDecimal = cleaned.substring(
        decimalIndex + 1,
        decimalIndex + 3,
      );
      const reconstructed = `${beforeDecimal}.${afterDecimal}`;
      const val = parseFloat(reconstructed) || 0;
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Amount (USD)</div>
      <div className="relative">
        <span className="absolute left-3 translate-y-1/4">$</span>
        <Input
          type="number"
          step="any"
          min="0"
          value={value}
          onChange={(e) => parseAmountValue(e.target.value)}
          placeholder="0.00"
          className="pl-6"
        />
      </div>
    </div>
  );
}
