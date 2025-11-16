import { useError } from "@/app/home/context/ErrorContext";
import { useGroup } from "@/app/home/context/GroupContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { formatDate } from "@/app/utils/utils";
import { Separator } from "@/components/ui/separator";
import GroupSettingsSkeleton from "./GroupSettingsSkeleton";

export default function GroupSettingsCard() {
  const { group, groupLoading, updateGroupDetails } = useGroup();
  const { setError } = useError();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!group) return;

    setName(group.name || "");
    setDescription(group.description || "");
  }, [group]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    } else if (!group) {
      setError("Invalid group, refresh and try again");
      return;
    }

    setIsSaving(true);
    const updatedSuccess = await updateGroupDetails({
      groupId: group.id,
      newName: name.trim(),
      newDescription: description.trim(),
    });
    setIsSaving(false);

    setIsEditing(false);
    if (!updatedSuccess) {
      setError("Failed to update group details");
      return;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(group?.name || "");
    setDescription(group?.description || "");
  };

  if (groupLoading || !group) return <GroupSettingsSkeleton />;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl lg:text-3xl font-bold">Group Settings</h1>
        </div>
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a short description"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                size="sm"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-muted-foreground text-xs">Name</Label>
              <p className="text-lg font-medium">{group.name}</p>
            </div>
            {group.description && (
              <div>
                <Label className="text-muted-foreground text-xs">
                  Description
                </Label>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>
            )}

            <Button
              onClick={() => setIsEditing(true)}
              variant="link"
              className="h-auto p-0 text-sm"
            >
              Edit group details
            </Button>
          </div>
        )}
        <Separator />
        <div>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(group.createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
