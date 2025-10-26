import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useGroup } from "@/app/home/context/GroupContext";
import { ExpenseSplit } from "@/types/expense";
import { useEffect, useState } from "react";

interface SplitOptionsCollapsibleProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  splits: Record<string, ExpenseSplit>;
  setSplits: (splits: Record<string, ExpenseSplit>) => void;
  transactionTotal: number;
}

export default function SplittingCollapsible({
  open,
  setOpen,
  splits,
  setSplits,
  transactionTotal,
}: SplitOptionsCollapsibleProps) {
  const { groupMembers } = useGroup();

  useEffect(() => {}, [transactionTotal]);
  const handlePercentageChange = (memberId: string, percentage: number) => {
    setSplits({
      ...splits,
      [memberId]: {
        ...splits[memberId],
        percentage,
      },
    });
  };

  console.log(splits);

  //   const handleInputChange = (memberId: string, percentageStr: string) => {
  //     console.log(memberId, percentageStr);
  //     const percentage = parseFloat(percentageStr) || 0;

  //   };
  console.log(splits);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
        Split Options
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 transition-all duration-300 ease-in-out">
        <div className="grid gap-3">
          {groupMembers?.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <label className="text-sm flex-1 truncate">
                {member.nickname}
              </label>
              <PercentageInput
                value={splits[member.id]?.percentage || 0}
                handlePercentageChange={(val) =>
                  handlePercentageChange(member.id, val)
                }
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface PercentageInputProps {
  value: number;
  handlePercentageChange: (value: number) => void;
}

function PercentageInput({
  value,
  handlePercentageChange,
}: PercentageInputProps) {
  const [inputValue, setInputValue] = useState<string>(
    value ? value.toFixed(2) : "",
  );

  const handleInputChange = (input: string) => {
    const cleaned = input.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    let result = parts[0];

    if (parts.length > 1) {
      result += "." + parts[1].substring(0, 2);
    }

    setInputValue(result);
  };

  const handleBlur = () => {
    if (inputValue === "" || inputValue === ".") {
      handlePercentageChange(0);
      setInputValue("");
      return;
    }

    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      handlePercentageChange(0);
      setInputValue("");
    } else {
      const clamped = Math.min(Math.max(parsed, 0), 100); // enforce 0–100
      handlePercentageChange(clamped);
      setInputValue(clamped.toFixed(2));
    }
  };

  return (
    <Input
      type="text"
      placeholder="0.00"
      value={inputValue}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={handleBlur}
      className="w-20"
    />
  );
}
