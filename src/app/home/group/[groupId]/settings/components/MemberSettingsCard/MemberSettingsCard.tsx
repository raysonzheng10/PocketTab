import { Card, CardContent } from "@/components/ui/card";
import { useGroup } from "@/app/home/context/GroupContext";
import CurrentUserContent from "./CurrentUserContent";
import { Separator } from "@/components/ui/separator";
import MemberSettingsSkeleton from "./MemberSettingsSkeleton";
import OtherMembersContent from "./OtherMembersContent";

export default function MemberSettingsCard() {
  const { groupLoading, groupMembers, userGroupMemberId } = useGroup();

  const currentUser = groupMembers.find((m) => m.id === userGroupMemberId);

  if (groupLoading || !currentUser) {
    return <MemberSettingsSkeleton />;
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-6">
        {/* Header  */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl lg:text-3xl font-bold">Member Settings</h1>
        </div>
        {/* Current User Section */}
        <CurrentUserContent currentUser={currentUser} />

        <Separator />
        {/* Other Members Section */}
        <OtherMembersContent />
      </CardContent>
    </Card>
  );
}
