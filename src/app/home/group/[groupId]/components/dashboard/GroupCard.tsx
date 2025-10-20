import { useGroup } from "@/app/home/context/GroupContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Users, Copy, Share2, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function GroupCard() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { group, groupLoading, groupMembers } = useGroup();
  const [copied, setCopied] = useState(false);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?groupId=${groupId}`
      : "";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      // only run in browser, can't do this serverside
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset to false after 2 seconds
    }
  };

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
            <Popover
              open={isSharePopoverOpen}
              onOpenChange={setIsSharePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Invite Link</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone with this link can join the group
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={inviteLink}
                      className="font-mono text-xs"
                    />
                    <Button
                      onClick={handleCopy}
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
              {groupMembers.map((member) => (
                <Badge
                  key={member.id}
                  variant="secondary"
                  className="px-2 py-0.5 text-xs"
                >
                  {member.nickname || "No name"}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
