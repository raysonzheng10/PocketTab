import { DetailedGroupMember, Group } from "@/types";

export const demoGroup: Group = {
  id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  name: "Roommates - Fall 2024",
  description: "Shared apartment expenses",
  createdAt: new Date("2024-09-01T08:00:00Z"),
};

export const demoGroupMembers: DetailedGroupMember[] = [
  {
    id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    createdAt: new Date("2024-09-01T08:00:00Z"),
    nickname: "Alex",
    leftAt: null,
    active: true,
    userId: "550e8400-e29b-41d4-a716-446655440000", // demo user
    userEmail: "demo@example.com",
  },
  {
    id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
    createdAt: new Date("2024-09-01T08:15:00Z"),
    nickname: "Jordan",
    leftAt: null,
    active: true,
    userId: "6a0e8400-e29b-41d4-a716-446655440001",
    userEmail: "jordan.smith@example.com",
  },
  {
    id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
    createdAt: new Date("2024-09-01T09:30:00Z"),
    nickname: "Sam",
    leftAt: null,
    active: true,
    userId: "7b0e8400-e29b-41d4-a716-446655440002",
    userEmail: "sam.chen@example.com",
  },
  {
    id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
    createdAt: new Date("2024-09-02T10:00:00Z"),
    nickname: "Taylor",
    leftAt: null,
    active: true,
    userId: "8c0e8400-e29b-41d4-a716-446655440003",
    userEmail: "taylor.williams@example.com",
  },
  {
    id: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b",
    createdAt: new Date("2024-09-03T11:20:00Z"),
    nickname: "Morgan",
    leftAt: new Date("2024-10-15T14:30:00Z"),
    active: false,
    userId: "9d0e8400-e29b-41d4-a716-446655440004",
    userEmail: "morgan.davis@example.com",
  },
];
