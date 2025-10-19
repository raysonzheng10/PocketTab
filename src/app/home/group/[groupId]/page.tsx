"use client";
import { Suspense, useEffect } from "react";
// import { useParams } from "next/navigation";
import { useError } from "../../context/ErrorContext";
import { useGroup } from "../../context/GroupContext";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Copy, Users, ChevronDown, ChevronUp } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
import GroupCard from "./components/dashboard/GroupCard";
import SettlementCard from "./components/dashboard/SettlementCard";

function PageContent() {
  const { setError } = useError();
  const { error: groupContextError } = useGroup();

  // const [isBalanceDetailsOpen, setIsBalanceDetailsOpen] = useState(false);

  useEffect(() => {
    setError(groupContextError);
  }, [groupContextError, setError]);

  // const params = useParams();
  // const groupId = params.groupId as string;

  // const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Group header always on its own row */}
        <GroupCard />

        {/* Settlement cards layout */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="flex-1">
            <SettlementCard />
          </div>
          <div className="flex-1">
            <SettlementCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <PageContent />
    </Suspense>
  );
}
