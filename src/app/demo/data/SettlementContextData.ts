import { DetailedSettlement } from "@/types";

export const demoSettlements: DetailedSettlement[] = [
  {
    groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e", // Jordan
    nickname: "Jordan",
    amount: 415, // Jordan owes Alex
  },
  {
    groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Sam
    nickname: "Sam",
    amount: -55, // Alex owes Sam
  },
  {
    groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // Taylor
    nickname: "Taylor",
    amount: 270, // Taylor owes Alex
  },
];

export const demoSettlementTotal: number = 630;
