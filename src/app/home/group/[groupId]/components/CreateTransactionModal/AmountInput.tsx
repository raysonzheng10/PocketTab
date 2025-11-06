import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function AmountInput({
  amount,
  setAmount,
}: {
  amount: number;
  setAmount: (amount: number) => void;
}) {
  const [inputValue, setInputValue] = useState<string>("");

  // Sync input value when amount prop changes
  useEffect(() => {
    if (amount > 0) {
      setInputValue(amount.toFixed(2));
    } else {
      setInputValue("");
    }
  }, [amount]);

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
