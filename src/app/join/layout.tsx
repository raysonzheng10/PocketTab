"use client";
import { UserProvider } from "../home/context/UserContext";

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}