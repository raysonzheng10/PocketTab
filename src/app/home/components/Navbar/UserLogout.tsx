import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

interface UserSectionProps {
  user: { email?: string } | null;
  userLoading: boolean;
  setError: (error: string) => void;
}

export default function UserLogout({
  user,
  userLoading,
  setError,
}: UserSectionProps) {
  const pathname = usePathname();
  const isDemoPage = pathname.startsWith("/demo");

  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    if (isDemoPage) {
      window.location.href = "/";
      return;
    }
    setIsLogoutLoading(true);
    try {
      const res = await fetch("/api/protected/auth/clearToken", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to log out");

      // use location.href to refresh cached state
      window.location.href = "/";
    } catch {
      setError("Failed to log out.");
      setIsLogoutLoading(false);
    }
  };

  const clearTokens = async () => {
    try {
      const res = await fetch("/api/protected/auth/clearToken", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to log out");
    } catch {
      setError("Failed to log out.");
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      {userLoading ? (
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
        {isDemoPage ? (
          <span className="font-medium">Exit Demo</span>
        ) : (
          <span className="font-medium">
            {isLogoutLoading ? "Logging out..." : "Logout"}
          </span>
        )}
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-4 py-3 h-auto text-red-600 hover:text-red-600 hover:bg-red-50"
        onClick={clearTokens}
      >
        Clear Tokens
      </Button>
    </div>
  );
}
