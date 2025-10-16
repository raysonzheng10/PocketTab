import type { Group } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface Props {
  groups: Group[];
  onSelect: (groupId: string) => void;
}

export const GroupList = ({ groups, onSelect }: Props) => {
  if (!groups.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No groups yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first group to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <Card
          key={group.id}
          onClick={() => onSelect(group.id)}
          className="cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg font-semibold">
                {group.name || "Unnamed Group"}
              </CardTitle>
              {group.description && (
                <CardDescription className="text-sm">
                  {group.description}
                </CardDescription>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
