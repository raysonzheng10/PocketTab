import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useGroup } from "@/app/home/context/GroupContext";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ExpenseSplit } from "@/types";

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

  const [isModified, setIsModified] = useState(false);
  const [activeMembers, setActiveMembers] = useState<string[]>(() =>
    groupMembers.map((m) => m.id),
  );

  // function to split evenly based on current activeMembers
  const autoEvenSplit = useCallback(
    (activeMembers: string[]) => {
      const equalShare =
        activeMembers.length > 0 ? 100 / activeMembers.length : 0;
      const splitObj: Record<string, ExpenseSplit> = {};
      activeMembers.forEach((id) => {
        splitObj[id] = {
          percentage: equalShare,
          amount: (equalShare / 100) * transactionTotal,
        };
      });
      return splitObj;
    },
    [transactionTotal],
  );

  useEffect(() => {
    if (!isModified) {
      setSplits(autoEvenSplit(activeMembers));
    } else {
      const updated = { ...splits };
      activeMembers.forEach((id) => {
        if (updated[id]) {
          updated[id].amount =
            (updated[id].percentage / 100) * transactionTotal;
        }
      });
      setSplits(updated);
    }

    // intentionally only dependent on transactionTotal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionTotal]);

  const toggleMember = (id: string) => {
    setActiveMembers((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (!isModified) {
      setSplits(autoEvenSplit(activeMembers));
    }
  }, [activeMembers, isModified, autoEvenSplit, setSplits]);

  // Handle percentage change
  const handlePercentageChange = (memberId: string, percentage: number) => {
    const currentPercentage = splits[memberId]?.percentage || 0;
    if (Math.abs(currentPercentage - percentage) < 0.01) {
      return;
    }

    setIsModified(true);
    const updated = {
      ...splits,
      [memberId]: {
        ...splits[memberId],
        percentage,
        amount: (percentage / 100) * transactionTotal,
      },
    };
    setSplits(updated);
  };

  const handleReset = () => {
    setIsModified(false);
    setSplits(autoEvenSplit(activeMembers));
  };

  // Calculate status description
  const getStatusDescription = () => {
    if (activeMembers.length === 1) {
      return "Split With 1 person";
    }

    const equalShare = 100 / activeMembers.length;
    const isEvenSplit = activeMembers.every(
      (id) => Math.abs((splits[id]?.percentage || 0) - equalShare) < 0.01,
    );

    if (isEvenSplit) {
      return `Even Split With ${activeMembers.length} People`;
    }

    return `Custom Split With ${activeMembers.length} People`;
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex flex-row justify-between items-center gap-2 ">
        <div className="text-sm font-medium">
          {"Manage Splitting Options - "}
          <span className="text-gray-500 font-normal">
            {getStatusDescription()}
          </span>
        </div>
        <ChevronDown
          className={`size-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="pt-4">
        <div className="w-full flex flex-col gap-4 overflow-hidden">
          {/* Member entries with checkboxes and percentage inputs */}
          {groupMembers?.map((member) => {
            const isActive = activeMembers.includes(member.id);
            const split = splits[member.id] || { percentage: 0, amount: 0 };

            return (
              <div
                key={member.id}
                className={`flex flex-row items-center gap-1 transition ${
                  !isActive && "opacity-60"
                }`}
              >
                <div className="flex flex-row items-center gap-2 h-12 flex-1 min-w-0">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={() => toggleMember(member.id)}
                    className="shrink-0"
                  />
                  <div className="truncate text-sm font-medium text-gray-800">
                    {member.nickname}
                  </div>
                </div>
                {isActive && (
                  <div className="flex flex-row items-center gap-1.5 shrink-0">
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      ${split.amount.toFixed(2)}
                    </span>

                    <PercentageInput
                      value={split.percentage}
                      handlePercentageChange={(val) =>
                        handlePercentageChange(member.id, val)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
          {isModified && (
            <div className="w-full">
              <Button
                variant="outline"
                onClick={handleReset}
                className="text-xs w-full"
              >
                Reset to Even Splits
              </Button>
            </div>
          )}
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

  useEffect(() => {
    setInputValue(value ? value.toFixed(2) : "");
  }, [value]);

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
      setInputValue("0.00");
      return;
    }

    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      handlePercentageChange(0);
      setInputValue("0.00");
    } else {
      const clamped = Math.min(Math.max(parsed, 0), 100);
      handlePercentageChange(clamped);
      setInputValue(clamped.toFixed(2));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Input
        type="text"
        placeholder="0.00"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onBlur={handleBlur}
        className="w-18 text-right h-6"
      />
      <span className="text-sm text-gray-800">%</span>
    </div>
  );
}
