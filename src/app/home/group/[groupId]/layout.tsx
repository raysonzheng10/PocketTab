"use client";
import { GroupProvider } from "../../context/GroupContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GroupProvider>{children}</GroupProvider>;
}
