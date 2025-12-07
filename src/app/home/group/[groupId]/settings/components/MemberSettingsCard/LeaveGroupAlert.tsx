import { useError } from "@/app/home/context/ErrorContext";
import { useGroup } from "@/app/home/context/GroupContext";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function LeaveGroupAlert() {
  const { userGroupMemberId, removeGroupMemberFromGroup } = useGroup();
  const { setError } = useError();
  const pathname = usePathname();

  const [isLeavingGroup, setIsLeavingGroup] = useState<boolean>(false);
  const isDemoPage = pathname.startsWith("/demo");

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
            {isDemoPage
              ? "Leaving groups is not available in demo mode."
              : "Are you sure you want to leave this group? You can only rejoin the group given the join URL."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isDemoPage ? (
            <AlertDialogCancel>Close</AlertDialogCancel>
          ) : (
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                loading={isLeavingGroup}
                disabled={isLeavingGroup}
                onClick={handleLeaveGroup}
              >
                Leave Group
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
