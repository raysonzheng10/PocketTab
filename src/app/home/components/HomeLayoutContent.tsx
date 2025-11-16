import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { useError } from "../context/ErrorContext";
import { useUser } from "../context/UserContext";
import ErrorAlert from "./ErrorAlert";
import GroupNavbar from "./Navbar/GroupNavbar";
import HomeNavbar from "./Navbar/HomeNavbar";
import MobileHeader from "./Navbar/MobileHeader";

export default function HomeLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const { setError } = useError();
  const { error: userError } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isGroupPage = pathname.startsWith("/home/group");
  const isDemoPage = pathname.startsWith("/demo");
  const showGroupNavBar = isGroupPage || isDemoPage;

  // Handle user errors
  useEffect(() => {
    if (userError) setError(userError);
  }, [userError, setError]);

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ErrorAlert />

      {/* Mobile header is z-40 */}
      <MobileHeader
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
         fixed lg:hidden inset-y-0 right-0 z-50
          transform transition-transform duration-250 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {showGroupNavBar ? (
          <GroupNavbar onNavigate={handleCloseMobileMenu} setError={setError} />
        ) : (
          <HomeNavbar onNavigate={handleCloseMobileMenu} setError={setError} />
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        {showGroupNavBar ? (
          <GroupNavbar onNavigate={handleCloseMobileMenu} setError={setError} />
        ) : (
          <HomeNavbar onNavigate={handleCloseMobileMenu} setError={setError} />
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pt-14 lg:pt-0 overflow-auto">{children}</main>
    </div>
  );
}
