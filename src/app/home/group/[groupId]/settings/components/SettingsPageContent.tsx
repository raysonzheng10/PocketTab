import GroupSettingsCard from "./GroupSettingsCard/GroupSettingsCard";
import MemberSettingsCard from "./MemberSettingsCard/MemberSettingsCard";

export default function SettingsPageContent() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <GroupSettingsCard />
        <MemberSettingsCard />
      </div>
    </div>
  );
}
