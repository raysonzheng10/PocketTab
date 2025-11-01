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

interface OneTimeTransactionContentProps {
  title: string;
  setTitle: (title: string) => void;
  setAmount: (amount: number) => void;
  date: Date;
  setDate: (date: Date) => void;
  payerId: string;
  setPayerId: (id: string) => void;
}

export default function OneTimeTransactionContent({
  title,
  setTitle,
  setAmount,
  date,
  setDate,
  payerId,
  setPayerId,
}: OneTimeTransactionContentProps) {
  const { groupMembers } = useGroup();
  const [isPayerPopoverOpen, setIsPayerPopoverOpen] = useState<boolean>(false);

  return (
    <TabsContent
      value="one-time"
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
        <AmountInput setAmount={setAmount} />
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
    </TabsContent>
  );
}
