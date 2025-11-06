import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettlementCardSkeleton() {
  return (
    <Card className="shadow-sm overflow-auto">
      <CardContent className="pt-0 space-y-3">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Summary Card */}
        <div className="p-6 mb-4 border-2 rounded-lg">
          <div className="text-center">
            <Skeleton className="h-6 w-24 mx-auto mb-2" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Debts + Credits Skeleton */}
        <Skeleton className="w-full h-16" />
      </CardContent>
    </Card>
  );
}
