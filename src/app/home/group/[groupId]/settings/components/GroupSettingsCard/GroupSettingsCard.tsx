import { Card, CardContent } from "@/components/ui/card";

export default function GroupSettingsCard() {
  if (false) {
    return <div>loading</div>;
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-6">
        {/* Header  */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl lg:text-3xl font-bold">Group Settings</h1>
        </div>
      </CardContent>
    </Card>
  );
}
