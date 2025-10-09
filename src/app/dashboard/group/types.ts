export interface Group {
  name: string | null;
  description: string | null;
  id: string;
  createdAt: Date;
}

export interface GroupMember {
  id: string;
  createdAt: Date;
  nickname: string;
}

export interface DetailedTransaction {
  id: string;
  createdAt: Date;
  amount: number;
  title: string;
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
