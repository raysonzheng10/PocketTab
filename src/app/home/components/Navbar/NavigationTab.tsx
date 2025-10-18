import { Button } from "@/components/ui/button";

interface NavButtonProps {
  isActive: boolean;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

export default function NavigationTab({
  isActive,
  icon,
  text,
  onClick,
}: NavButtonProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      onClick={onClick}
      className="w-full justify-start gap-3 px-4 py-3 h-auto"
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Button>
  );
}
