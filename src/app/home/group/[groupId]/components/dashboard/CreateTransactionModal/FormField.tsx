import { ReactNode } from "react";

export default function FormField({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">{title}</div>
      {children}
    </div>
  );
}
