import { useError } from "@/app/home/context/ErrorContext";
import { useGroup } from "@/app/home/context/GroupContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LeaveGroupAlert() {
  const { userGroupMemberId, removeGroupMemberFromGroup } = useGroup();
  const { setError } = useError();

  const [isLeavingGroup, setIsLeavingGroup] = useState<boolean>(false);

  const handleLeaveGroup = async () => {
    setIsLeavingGroup(true);
    const leaveSuccess = await removeGroupMemberFromGroup({
      groupMemberId: userGroupMemberId,
    });

    if (!leaveSuccess) {
      setIsLeavingGroup(false);
      setError("Failed to leave group");
      return;
    }

    window.location.href = "/home";
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={isLeavingGroup}
          className="sm:shrink-0"
        >
          {isLeavingGroup ? "Leaving..." : "Leave Group"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this group?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this group? You can only rejoin the
            group given the join URL.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleLeaveGroup}>
            Leave Group
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
