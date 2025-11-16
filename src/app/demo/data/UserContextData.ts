import { Group, User } from "@/types";

export const demoUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  createdAt: new Date("2025-01-15T10:30:00Z"),
  updatedAt: new Date("2025-10-01T14:20:00Z"),
  email: "demo@example.com",
};

export const demoUserGroups: Group[] = [
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "Roommates - Fall 2025",
    description: "Shared apartment expenses",
    createdAt: new Date("2025-09-01T08:00:00Z"),
  },
];
