import { useGroup } from "@/app/home/context/GroupContext";
import { formatDate } from "@/app/utils/utils";
import { useState } from "react";
import ShareGroupPopover from "../../../components/dashboard/GroupCard/ShareGroupPopover";
import { Badge } from "@/components/ui/badge";

export default function OtherMembersContent() {
  const { groupMembers, userGroupMemberId } = useGroup();

  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState<boolean>(false);

  const otherMembers = groupMembers
    .filter((m) => m.id !== userGroupMemberId)
    .sort((a, b) => {
      if (a.active === b.active) return 0;
      return a.active ? -1 : 1;
    });

  return (
    <div>
      <div className="flex flex-row gap-2 justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">
          Other Members ({otherMembers.length})
        </h3>
        <ShareGroupPopover
          open={isSharePopoverOpen}
          onOpenChange={setIsSharePopoverOpen}
        />
      </div>
      {otherMembers.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">
          No other members yet
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {otherMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2"
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium truncate ${!member.active ? "text-gray-400" : ""}`}
                >
                  {member.nickname}
                </p>
                <p className="text-sm text-gray-500">
                  {member.active
                    ? `Joined ${formatDate(member.createdAt)}`
                    : member.leftAt
                      ? `Left ${formatDate(member.leftAt)}`
                      : ""}
                </p>
              </div>
              {!member.active && (
                <Badge className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded shrink-0">
                  Not in Group
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
