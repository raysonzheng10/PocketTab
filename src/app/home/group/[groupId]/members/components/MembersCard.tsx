import { Card, CardContent } from "@/components/ui/card";
import { useGroup } from "@/app/home/context/GroupContext";
import CurrentUserContent from "./CurrentUserContent";
import MembersCardSkeleton from "./MembersCardSkeleton";
import { Separator } from "@/components/ui/separator";
import OtherMembersContent from "./OtherMembersContent";

export default function MembersCard() {
  const { groupLoading, groupMembers, userGroupMemberId } = useGroup();

  console.log(groupMembers);
  const currentUser = groupMembers.find((m) => m.id === userGroupMemberId);

  if (groupLoading || !currentUser) {
    return <MembersCardSkeleton />;
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-6">
        {/* Current User Section */}
        <CurrentUserContent currentUser={currentUser} />

        <Separator />
        {/* Other Members Section */}
        <OtherMembersContent />
      </CardContent>
    </Card>
  );
}
