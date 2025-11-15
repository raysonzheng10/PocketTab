"use client";
import HomeLayoutContent from "./components/HomeLayoutContent";
import { ErrorProvider } from "./context/ErrorContext";
import { GroupProvider } from "./context/GroupContext";
import { UserProvider } from "./context/UserContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorProvider>
      <UserProvider>
        <GroupProvider>
          <HomeLayoutContent>{children}</HomeLayoutContent>
        </GroupProvider>
      </UserProvider>
    </ErrorProvider>
  );
}
