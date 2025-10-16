"use client";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X, Users, Settings, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReactNode, useState, useEffect } from "react";
import { UserProvider, useUser } from "./context/UserContext";
import { ErrorProvider, useError } from "./context/ErrorContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ErrorProvider>
        <HomeLayoutContent>{children}</HomeLayoutContent>
      </ErrorProvider>
    </UserProvider>
  );
}

function HomeLayoutContent({ children }: { children: ReactNode }) {
  const { error, setError, clearError } = useError();
  const { user, loading, error: userError } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const getMobileTitle = () => {
    if (pathname === "/home") return "Manage Groups";
    if (pathname === "/home/settings") return "Account Settings";
    return "Divvy";
  };

  // Handle user errors
  useEffect(() => {
    if (userError) setError(userError);
  }, [userError, setError]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/protected/auth/clearToken", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to log out");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToManageGroups = () => {
    router.push("/home");
    setIsMobileMenuOpen(false);
  };

  const handleNavigateToAccountSettings = () => {
    router.push("/home/settings");
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Error Alert - Fixed at top */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4">
          <Alert variant="destructive" className="shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-4 text-sm underline hover:no-underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">{getMobileTitle()}</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-md transition"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar / Mobile Slide-in */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Desktop Header */}
        <div className="p-6 border-b border-gray-200  lg:block">
          <h1 className="text-xl font-bold text-gray-800">Divvy</h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 overflow-y-auto mt-0">
          <div className="space-y-2">
            <button
              onClick={handleNavigateToManageGroups}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Manage Groups</span>
            </button>

            <button
              onClick={handleNavigateToAccountSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition duration-200"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Account Settings</span>
            </button>
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

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
