import { DetailedTransaction } from "@/types";

export const demoTransactions: DetailedTransaction[] = [
  {
    id: "30127907-9e7d-4088-9e9e-dd519bb9b844",
    createdAt: new Date("2024-10-02T13:00:00Z"),
    amount: 48,
    title: "Lunch",
    date: new Date("2024-10-02T12:30:00Z"),
    isReimbursement: false,
    groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // Alex paid
    groupMemberNickname: "Alex",
    detailedExpenses: [
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 12,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 12,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 12,
      },
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 12,
      },
    ],
  },
  {
    id: "e66ef346-eedb-4a3d-9089-5f096a45875b",
    createdAt: new Date("2024-10-05T18:45:00Z"),
    amount: 90,
    title: "Groceries",
    date: new Date("2024-10-05T18:15:00Z"),
    isReimbursement: false,
    groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e", // Jordan paid
    groupMemberNickname: "Jordan",
    detailedExpenses: [
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 30,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 30,
      },
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 30,
      },
    ],
  },
  {
    id: "1bc86c57-1735-442d-a1e7-7c504f8fce39",
    createdAt: new Date("2024-10-10T09:10:00Z"),
    amount: 120,
    title: "Concert Tickets",
    date: new Date("2024-10-09T21:00:00Z"),
    isReimbursement: false,
    groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Sam paid
    groupMemberNickname: "Sam",
    detailedExpenses: [
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 40,
      },
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 40,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 40,
      },
    ],
  },
  {
    id: "02575b9c-9a91-4ccb-80f0-b70e4973fd4d",
    createdAt: new Date("2024-10-12T14:00:00Z"),
    amount: 20,
    title: "Uber to event",
    date: new Date("2024-10-12T13:40:00Z"),
    isReimbursement: false,
    groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // Taylor paid
    groupMemberNickname: "Taylor",
    detailedExpenses: [
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 10,
      },
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 10,
      },
    ],
  },
  {
    id: "50ee8164-3afa-4676-b353-3686cda62dd5",
    createdAt: new Date("2024-10-15T10:45:00Z"),
    amount: 35,
    title: "Coffee + Snacks",
    date: new Date("2024-10-15T10:30:00Z"),
    isReimbursement: false,
    groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // Alex paid
    groupMemberNickname: "Alex",
    detailedExpenses: [
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 10,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 15,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 10,
      },
    ],
  },
];
