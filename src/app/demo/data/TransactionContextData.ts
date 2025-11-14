import { DetailedTransaction } from "@/types";

export const demoTransactions: DetailedTransaction[] = [
  {
    id: "50ee8164-3afa-4676-b353-3686cda62dd5",
    createdAt: new Date("2025-10-15T10:45:00Z"),
    amount: 1600,
    title: "Apartment Rent",
    date: new Date("2025-10-01T08:00:00Z"),
    isReimbursement: false,
    groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // Alex paid
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
  {
    id: "30127907-9e7d-4088-9e9e-dd519bb9b844",
    createdAt: new Date("2025-10-02T13:00:00Z"),
    amount: 80,
    title: "Uber Eats Lunch",
    date: new Date("2025-10-02T12:30:00Z"),
    isReimbursement: false,
    groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // Alex paid
    groupMemberNickname: "Alex",
    detailedExpenses: [
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 20,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 20,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 20,
      },
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 20,
      },
    ],
  },
  {
    id: "e66ef346-eedb-4a3d-9089-5f096a45875b",
    createdAt: new Date("2025-10-05T18:45:00Z"),
    amount: 20,
    title: "Cleaning Supplies",
    date: new Date("2025-10-05T18:15:00Z"),
    isReimbursement: false,
    groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e", // Jordan paid
    groupMemberNickname: "Jordan",
    detailedExpenses: [
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 5,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 5,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 5,
      },
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 5,
      },
    ],
  },
  {
    id: "1bc86c57-1735-442d-a1e7-7c504f8fce39",
    createdAt: new Date("2025-10-10T09:10:00Z"),
    amount: 500,
    title: "Concert Tickets",
    date: new Date("2025-10-09T21:00:00Z"),
    isReimbursement: false,
    groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Sam paid
    groupMemberNickname: "Sam",
    detailedExpenses: [
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 250,
      },
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 250,
      },
    ],
  },
  {
    id: "02575b9c-9a91-4ccb-80f0-b70e4973fd4d",
    createdAt: new Date("2025-10-12T14:00:00Z"),
    amount: 300,
    title: "Alex/Taylor Bathroom Repairs",
    date: new Date("2025-10-12T13:40:00Z"),
    isReimbursement: false,
    groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // Taylor paid
    groupMemberNickname: "Taylor",
    detailedExpenses: [
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 150,
      },
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 150,
      },
    ],
  },
  {
    id: "8af38a83-e7af-4fc8-99a3-c08a3778962f",
    createdAt: new Date("2025-10-13T14:00:00Z"),
    amount: 900,
    title: "Living Room TV",
    date: new Date("2025-10-13T13:40:00Z"),
    isReimbursement: false,
    groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Taylor paid
    groupMemberNickname: "Sam",
    detailedExpenses: [
      {
        groupMemberId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        groupMemberNickname: "Alex",
        amount: 225,
      },
      {
        groupMemberId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        groupMemberNickname: "Jordan",
        amount: 225,
      },
      {
        groupMemberId: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        groupMemberNickname: "Sam",
        amount: 225,
      },
      {
        groupMemberId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        groupMemberNickname: "Taylor",
        amount: 225,
      },
    ],
  },
];
