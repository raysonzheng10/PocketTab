"use client";
import { usePathname, useRouter } from "next/navigation";
import { Users, Settings } from "lucide-react";
import { useUser } from "../../context/UserContext";
import NavigationTab from "./NavigationTab";
import UserLogout from "./UserLogout";

interface NavbarProps {
  onNavigate?: () => void;
  setError: (error: string) => void;
}

export default function GroupNavbar({ onNavigate, setError }: NavbarProps) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isManageGroupsActive = pathname === "/home";
  const isAccountSettingsActive = pathname === "/home/settings";

  const handleNavigateToManageGroups = () => {
    router.push("/home");
    onNavigate?.();
  };

  const handleNavigateToAccountSettings = () => {
    router.push("/home/settings");
    onNavigate?.();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">GROUP NAV BAR</h1>
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
