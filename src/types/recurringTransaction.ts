import { DetailedExpense } from ".";

export interface DetailedRecurringTransaction {
  id: string;
  createdAt: Date;
  title: string;
  amount: number;
  interval: "daily" | "weekly" | "monthly";
  startDate: Date;
  endDate: Date | null;
  nextOccurence: Date;
  groupMemberId: string;
  groupMemberNickname: string;
  detailedExpenses: DetailedExpense[];
}
