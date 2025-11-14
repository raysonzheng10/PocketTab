import { DetailedRecurringTransaction } from "@/types";

export const demoRecurringTransactions: DetailedRecurringTransaction[] = [
  {
    id: "r1",
    createdAt: new Date("2024-09-01T08:00:00Z"),
    title: "Apartment Rent",
    amount: 1200,
    interval: "monthly",
    startDate: new Date("2024-09-01T00:00:00Z"),
    endDate: null,
    nextOccurence: new Date("2024-11-01T00:00:00Z"),
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
    ],
  },
];
