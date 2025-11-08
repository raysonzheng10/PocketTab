import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembersCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 space-y-6">
        <div className="pb-6 border-b">
          <Skeleton className="h-4 w-16 mb-4" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
        <div>
          <Skeleton className="h-12 w-full mb-4" />
        </div>
      </CardContent>
    </Card>
  );
}
