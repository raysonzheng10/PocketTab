"use client";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { UserProvider, useUser } from "./context/UserContext";
import { ErrorProvider, useError } from "./context/ErrorContext";
import { Navbar } from "./components/Navbar";
import { MobileHeader } from "./components/MobileHeader";
import { ErrorAlert } from "./components/ErrorAlert";

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
  const { error: userError } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getMobileTitle = () => {
    if (pathname === "/home") return "Manage Groups";
    if (pathname === "/home/settings") return "Account Settings";
    return "PocketTab";
  };

  // Handle user errors
  useEffect(() => {
    if (userError) setError(userError);
  }, [userError, setError]);

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ErrorAlert error={error} onDismiss={clearError} />

      <MobileHeader
        title={getMobileTitle()}
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-500 opacity-50 z-40"
          onClick={handleCloseMobileMenu}
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile slide-in */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Navbar onNavigate={handleCloseMobileMenu} setError={setError} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
