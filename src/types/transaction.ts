export interface DetailedTransaction {
  id: string;
  createdAt: Date;
  amount: number;
  title: string;
  date: Date;
  groupMemberId: string;
  groupMemberNickname: string;
}

export interface Expense {
  groupMemberId: string;
  amount: number;
}

export interface DetailedSettlements {
  settlements: Record<string, { nickname: string; amount: number }>;
  total: number;
}
