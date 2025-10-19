import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { Users, Badge, Copy } from "lucide-react";
import { Input } from "postcss";

export default function GroupCard() {
  const { group, groupLoading, groupMembers } = useGroup();
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            {groupLoading ? (
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
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Members - Compact */}
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

        <Separator />

        {/* Compact Invite Link */}
        <div className="flex gap-2">
          <Input
            readOnly
            value={
              typeof window !== "undefined"
                ? `${window.location.origin}/join?groupId=${groupId}`
                : ""
            }
            className="font-mono text-xs h-8"
          />
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(
                  `${window.location.origin}/join?groupId=${groupId}`,
                );
              }
            }}
            size="sm"
            variant="outline"
            className="h-8"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
