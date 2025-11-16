import { DetailedRecurringTransaction } from "@/types";

export const demoRecurringTransactions: DetailedRecurringTransaction[] = [
  {
    id: "30bbff9e-ed60-4181-a2d5-76905c386fb4",
    createdAt: new Date("2025-10-01T08:00:00Z"),
    title: "Apartment Rent",
    amount: 1600,
    interval: "monthly",
    startDate: new Date("2025-10-01T08:00:00Z"),
    endDate: null,
    nextOccurence: new Date("2025-11-01T08:00:00Z"),
    groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // Alex pays
    groupMemberNickname: "Alex",
    detailedExpenses: [
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 400,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 400,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 400,
      },
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 400,
      },
    ],
  },
];
