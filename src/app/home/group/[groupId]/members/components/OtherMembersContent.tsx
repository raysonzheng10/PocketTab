import { useGroup } from "@/app/home/context/GroupContext";
import { formatDate } from "@/app/utils/utils";
import { useState } from "react";
import ShareGroupPopover from "../../components/dashboard/GroupCard/ShareGroupPopover";

export default function OtherMembersContent() {
  const { groupMembers, userGroupMemberId } = useGroup();

  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState<boolean>(false);

  const otherMembers = groupMembers.filter((m) => m.id !== userGroupMemberId);

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
              <div>
                <p className="font-medium">{member.nickname}</p>
                <p className="text-sm text-gray-500">
                  Joined {formatDate(member.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
