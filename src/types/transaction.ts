import { DetailedExpense } from ".";

export interface DetailedTransaction {
  id: string;
  createdAt: Date;
  amount: number;
  title: string;
  date: Date;
  isReimbursement: boolean;
  groupMemberId: string;
  groupMemberNickname: string;
  detailedExpenses: DetailedExpense[];
}
