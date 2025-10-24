import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface CreateTransactionModalProps {
  //   groupId: string; // ID of the group the transaction belongs to
  //   onTransactionCreated?: (newTransaction: {
  //     amount: string;
  //     description: string;
  //   }) => void; // callback after creation
  open: boolean; // controlled open state
  onOpenChange: (open: boolean) => void; // called when modal wants to close/open
}

export default function CreateTransactionModal({
  open,
  onOpenChange,
}: CreateTransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  //   const handleCreateTransaction = () => {

  //   }
  //   const handleCreate = () => {
  //     console.log("Creating transaction for group:", groupId, {
  //       amount,
  //       description,
  //     });
  //     if (onTransactionCreated) {
  //       onTransactionCreated({ amount, description });
  //     }
  //     setOpen(false);
  //   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction to this group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, groceries..."
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
