import { useGroup } from "@/app/home/context/GroupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Check, Copy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface ShareGroupPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareGroupPopover({
  open,
  onOpenChange,
}: ShareGroupPopoverProps) {
  const pathname = usePathname();
  const { groupId } = useGroup();

  const [copied, setCopied] = useState(false);

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?groupId=${groupId}`
      : "";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      // only run in browser, can't do this serverside
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset to false after 2 seconds
    }
  };

  const isDemoPage = pathname.startsWith("/demo");
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="flex flex-row gap-2">
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Invite Others</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        {isDemoPage ? (
          <p className="text-muted-foreground font-medium text-center">
            Not available in the demo
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Invite Link</p>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can join the group
            </p>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={inviteLink}
                className="font-mono text-xs"
              />
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
