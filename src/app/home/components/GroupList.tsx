import type { Group } from "@/types";

interface Props {
  groups: Group[];
  onSelect: (groupId: string) => void;
}

export const GroupList = ({ groups, onSelect }: Props) => {
  if (!groups.length)
    return <p className="text-gray-500 italic">No groups yet</p>;

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelect(group.id)}
          className="flex flex-col text-left px-5 py-3 border border-gray-300 rounded-md hover:bg-green-100 cursor-pointer transition-colors duration-200"
        >
          <p>{group.name ?? "No group name yet"}</p>
          <p>{group.id}</p>
        </button>
      ))}
    </div>
  );
};
