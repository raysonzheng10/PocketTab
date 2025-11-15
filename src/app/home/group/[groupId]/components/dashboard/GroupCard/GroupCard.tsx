import { useGroup } from "@/app/home/context/GroupContext";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useState } from "react";
import ShareGroupPopover from "./ShareGroupPopover";

export default function GroupCard() {
  const { group, groupLoading, groupMembers, userGroupMemberId } = useGroup();
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {groupLoading || !group ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            ) : (
              <>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {group?.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {group?.description}
                </CardDescription>
              </>
            )}
          </div>

          {!groupLoading && group && (
            <ShareGroupPopover
              open={isSharePopoverOpen}
              onOpenChange={setIsSharePopoverOpen}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          {groupLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {/* Always show user badge first */}
              {groupMembers
                .sort((a, b) => {
                  if (a.id === userGroupMemberId) return -1;
                  if (b.id === userGroupMemberId) return 1;
                  return 0;
                })
                .map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs"
                  >
                    {member.nickname || "No name"}
                    {userGroupMemberId === member.id && " (You)"}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
