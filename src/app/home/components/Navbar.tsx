"use client";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Users, Settings, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { useState } from "react";

interface NavbarProps {
  onNavigate?: () => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { user, loading } = useUser();
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
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

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      const res = await fetch("/api/protected/auth/clearToken", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to log out");
      router.push("/");
    } catch (err) {
      console.error(err);
      setIsLogoutLoading(false);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Divvy</h1>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          <Button
            variant={isManageGroupsActive ? "secondary" : "ghost"}
            onClick={handleNavigateToManageGroups}
            className="w-full justify-start gap-3 px-4 py-3 h-auto"
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">Manage Groups</span>
          </Button>

          <Button
            variant={isAccountSettingsActive ? "secondary" : "ghost"}
            onClick={handleNavigateToAccountSettings}
            className="w-full justify-start gap-3 px-4 py-3 h-auto"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Account Settings</span>
          </Button>
        </div>
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-gray-200">
        {loading ? (
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ) : (
          <div className="mb-4 px-2">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.email}
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLogoutLoading}
          className="w-full justify-start gap-3 px-4 py-3 h-auto text-red-600 hover:text-red-600 hover:bg-red-50"
        >
          {isLogoutLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
          <span className="font-medium">
            {isLogoutLoading ? "Logging out..." : "Logout"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
