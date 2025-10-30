"use client";
import { usePathname, useRouter } from "next/navigation";
import { Users, Settings, X } from "lucide-react";
import { useUser } from "../../context/UserContext";
import NavigationTab from "./NavigationTab";
import UserLogout from "./UserLogout";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onNavigate?: () => void;
  setError: (error: string) => void;
}

export default function HomeNavbar({ onNavigate, setError }: NavbarProps) {
  const { user, userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isManageGroupsActive = pathname === "/home";
  const isAccountSettingsActive = pathname === "/home/account";

  const handleNavigateToManageGroups = () => {
    router.push("/home");
    onNavigate?.();
  };

  const handleNavigateToAccountSettings = () => {
    router.push("/home/account");
    onNavigate?.();
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
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
          <NavigationTab
            isActive={isManageGroupsActive}
            icon={<Users className="h-5 w-5" />}
            text="Manage Groups"
            onClick={handleNavigateToManageGroups}
          />
          <NavigationTab
            isActive={isAccountSettingsActive}
            icon={<Settings className="h-5 w-5" />}
            text="Account Settings"
            onClick={handleNavigateToAccountSettings}
          />
        </div>
      </div>

      <UserLogout user={user} userLoading={userLoading} setError={setError} />
    </div>
  );
}
