export interface DetailedRecurringTransaction {
  id: string;
  createdAt: Date;
  title: string;
  amount: number;
  interval: string;
  startDate: Date;
  endDate: Date | null;
  nextOccurence: Date;
  groupMemberId: string;
  groupMemberNickname: string;
}
