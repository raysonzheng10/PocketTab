"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  ArrowLeft,
  CreditCard,
  DollarSign,
  Home,
  X,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import NavigationTab from "./NavigationTab";
import UserLogout from "./UserLogout";
import { useGroup } from "../../context/GroupContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onNavigate?: () => void;
  setError: (error: string) => void;
}

export default function GroupNavbar({ onNavigate, setError }: NavbarProps) {
  const { user, userLoading } = useUser();
  const { group } = useGroup();
  const router = useRouter();
  const pathname = usePathname();

  const isTransactionsActive = pathname.endsWith("/transactions");
  const isSettlementsActive = pathname.endsWith("/settlements");
  const isMembersActive = pathname.endsWith("/members");
  const isGroupSettingsActive = pathname.endsWith("/settings");
  const isDashboardActive = !(
    isTransactionsActive ||
    isSettlementsActive ||
    isMembersActive ||
    isGroupSettingsActive
  );

  const isDemoPage = pathname.startsWith("/demo");

  const handleNavigateToManageGroups = () => {
    window.location.href = "/home";
    onNavigate?.();
  };

  const handleNavigateDashboard = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push("/demo");
    } else {
      router.push(`/home/group/${group.id}`);
    }
    onNavigate?.();
  };

  const handleNavigateTransactions = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push("/demo/transactions");
    } else {
      router.push(`/home/group/${group.id}/transactions`);
    }
    onNavigate?.();
  };

  const handleNavigateSettlements = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push("/demo/settlements");
    } else {
      router.push(`/home/group/${group.id}/settlements`);
    }
    onNavigate?.();
  };

  const handleNavigateGroupSettings = () => {
    if (!group) return;
    if (isDemoPage) {
      router.push("/demo/settings");
    } else {
      router.push(`/home/group/${group.id}/settings`);
    }
    onNavigate?.();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-row justify-between items-center p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">PocketTab</h1>
        <Button
          size="sm"
          variant="ghost"
          className="lg:hidden"
          onClick={onNavigate}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {!isDemoPage && (
            <>
              {/* Back to Groups */}
              <NavigationTab
                isActive={false} // or some state if needed
                icon={<ArrowLeft className="h-5 w-5" />}
                text="Back to Groups"
                onClick={handleNavigateToManageGroups}
              />

              <Separator />
            </>
          )}

          {/* Group Tabs */}
          <NavigationTab
            isActive={isDashboardActive}
            icon={<Home className="h-5 w-5" />}
            text="Dashboard"
            onClick={handleNavigateDashboard}
          />
          <NavigationTab
            isActive={isTransactionsActive}
            icon={<CreditCard className="h-5 w-5" />}
            text="Transactions"
            onClick={handleNavigateTransactions}
          />
          <NavigationTab
            isActive={isSettlementsActive}
            icon={<DollarSign className="h-5 w-5" />}
            text="Settlements"
            onClick={handleNavigateSettlements}
          />

          <NavigationTab
            isActive={isGroupSettingsActive}
            icon={<Settings className="h-5 w-5" />}
            text="Settings"
            onClick={handleNavigateGroupSettings}
          />
        </div>
      </div>

      <UserLogout user={user} userLoading={userLoading} setError={setError} />
    </div>
  );
}
