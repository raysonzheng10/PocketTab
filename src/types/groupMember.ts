export interface DetailedGroupMember {
  id: string;
  createdAt: Date;
  nickname: string;
  leftAt: Date | null;
  active: boolean;
  userId: string;
  userEmail: string;
}
