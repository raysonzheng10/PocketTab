import { useError } from "@/app/home/context/ErrorContext";
import { useGroup } from "@/app/home/context/GroupContext";
import { formatDate } from "@/app/utils/utils";
import { Button } from "@/components/ui/button";
import { DetailedGroupMember } from "@/types";
import { useState } from "react";
import LeaveGroupAlert from "./LeaveGroupAlert";

export interface CurrentUserContentProps {
  currentUser: DetailedGroupMember;
}

export default function CurrentUserContent({
  currentUser,
}: CurrentUserContentProps) {
  const { userGroupMemberId, updateGroupMemberNickname } = useGroup();
  const { setError } = useError();

  const [isEditingNickname, setIsEditingNickname] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");

  const [isUpdatingNickname, setIsUpdatingNickname] = useState<boolean>(false);

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      setError("New nickname cannot be empty");
      return;
    }

    setIsUpdatingNickname(true);
    const nicknameUpdateSuccess = await updateGroupMemberNickname({
      groupMemberId: userGroupMemberId,
      nickname: nickname.trim(),
    });
    setIsUpdatingNickname(false);

    if (!nicknameUpdateSuccess) {
      setError("Failed to update groupMember nickname");
      return;
    }
    setIsEditingNickname(false);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
        You
      </h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          {isEditingNickname ? (
            <div className="space-y-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={currentUser.nickname}
                className="w-full px-3 py-2 border rounded-md"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNickname}
                  disabled={isUpdatingNickname || !nickname.trim()}
                  size="sm"
                >
                  {isUpdatingNickname ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditingNickname(false);
                    setNickname("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium truncate">
                {currentUser.nickname}
              </p>
              <p className="text-sm text-gray-500">
                Joined {formatDate(currentUser.createdAt)}
              </p>
              <Button
                onClick={() => {
                  setNickname(currentUser.nickname);
                  setIsEditingNickname(true);
                }}
                variant="link"
                className="h-auto p-0 text-sm"
              >
                Edit nickname
              </Button>
            </div>
          )}
        </div>

        <LeaveGroupAlert />
      </div>
    </div>
  );
}
