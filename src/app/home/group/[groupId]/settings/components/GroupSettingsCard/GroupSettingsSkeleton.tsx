import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GroupSettingsSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-80" />
        </div>
        <div className="border-t pt-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
