export interface ExpenseSplit {
  groupMemberId: string;
  percentage: number;
  amount: number;
}

export interface DetailedExpense {
  groupMemberId: string;
  groupMemberNickname: string;
  amount: number;
}

export interface CreateTransactionExpense {
  groupMemberId: string;
  amount: number;
}
