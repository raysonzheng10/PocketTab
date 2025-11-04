"use client";
import { Menu, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGroup } from "../../context/GroupContext";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  onToggleMenu: () => void;
}

export default function MobileHeader({ onToggleMenu }: MobileHeaderProps) {
  const { groupId } = useGroup();
  const pathname = usePathname();
  const router = useRouter();

  const getMobileTitle = () => {
    if (pathname.endsWith("/home")) return "Manage Groups";
    if (pathname.endsWith("/account")) return "Account Settings";
    if (pathname.endsWith("/settings")) return "Group Settings";
    if (pathname.endsWith("/transactions")) return "Transactions";
    if (pathname.endsWith("/settlements")) return "Settlements";
    if (pathname.endsWith("/members")) return "Members";
    return "Dashboard";
  };

  const showBackArrow =
    pathname.endsWith("/settings") ||
    pathname.endsWith("/transactions") ||
    pathname.endsWith("/settlements") ||
    pathname.endsWith("/members");

  const handleBack = () => {
    if (groupId) router.push(`/home/group/${groupId}`);
    else router.push("/home");
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {showBackArrow ? (
          <Button
            onClick={handleBack}
            variant={"ghost"}
            className="flex flex-row items-center"
          >
            <ArrowLeft className="size-6" />
            <div>Back</div>
          </Button>
        ) : (
          <h1 className="text-lg font-bold text-gray-800">
            {getMobileTitle()}
          </h1>
        )}
      </div>

      <Button onClick={onToggleMenu} variant={"ghost"}>
        <Menu className="size-6" />
      </Button>
    </div>
  );
}
