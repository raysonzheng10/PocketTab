"use client";
import { Menu, X } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function MobileHeader({
  title,
  isMenuOpen,
  onToggleMenu,
}: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      <button
        onClick={onToggleMenu}
        className="p-2 hover:bg-gray-100 rounded-md transition"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
}
