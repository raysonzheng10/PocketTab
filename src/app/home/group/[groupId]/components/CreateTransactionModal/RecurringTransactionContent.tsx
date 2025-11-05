import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import AmountInput from "./AmountInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useGroup } from "@/app/home/context/GroupContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { capitalizeFirst } from "@/app/utils/utils";

interface OneTimeTransactionContentProps {
  title: string;
  setTitle: (title: string) => void;
  amount: number;
  setAmount: (amount: number) => void;
  date: Date;
  setDate: (date: Date) => void;
  payerId: string;
  setPayerId: (id: string) => void;
  interval: string;
  setInterval: (interval: string) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

const intervals = ["daily", "weekly", "monthly"];

export default function RecurringTransactionContent({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  payerId,
  setPayerId,
  interval,
  setInterval,
  endDate,
  setEndDate,
}: OneTimeTransactionContentProps) {
  const { groupMembers } = useGroup();
  const [isPayerPopoverOpen, setIsPayerPopoverOpen] = useState<boolean>(false);
  const [isIntervalPopoverOpen, setIsIntervalPopoverOpen] =
    useState<boolean>(false);

  return (
    <TabsContent
      value="recurring"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <FormField title="Title">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Transaction title"
        />
      </FormField>

      <FormField title="Amount">
        <AmountInput amount={amount} setAmount={setAmount} />
      </FormField>

      <FormField title="Paid By">
        <Popover open={isPayerPopoverOpen} onOpenChange={setIsPayerPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between font-normal">
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
                <CommandEmpty className="w-full">No member found.</CommandEmpty>
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

      <FormField title="Paid By">
        <Popover
          open={isIntervalPopoverOpen}
          onOpenChange={setIsIntervalPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between font-normal">
              <span className="truncate mr-1">
                {interval ? capitalizeFirst(interval) : "Select an interval"}
              </span>
              <ChevronsUpDown className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandList>
                <CommandGroup className="w-full">
                  {intervals.map((intv) => (
                    <CommandItem
                      key={intv}
                      value={intv}
                      onSelect={() => {
                        setInterval(intv);
                        setIsIntervalPopoverOpen(false);
                      }}
                      className="w-full"
                    >
                      <Check
                        className={`size-4 ${interval != intv && "opacity-0"}`}
                      />
                      <span className="truncate">{capitalizeFirst(intv)}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormField>

      <FormField title="Start Date">
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

      <FormField title="End Date (optional)">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 size-4" />
              {endDate ? format(endDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 max-w-[min(400px,calc(100vw-2rem))]">
            <Calendar
              mode="single"
              required={false}
              selected={endDate}
              onSelect={setEndDate}
              className="scale-90 sm:scale-100"
            />
          </PopoverContent>
        </Popover>
      </FormField>
    </TabsContent>
  );
}
