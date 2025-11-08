import {
  createGroupMember,
  getGroupMemberByUserIdAndGroupId,
  updateGroupMember,
} from "../repositories/groupMemberRepo";
import { getUserById } from "../repositories/userRepo";

export async function updateGroupMemberNickname(
  groupMemberId: string,
  newNickname: string,
) {
  const updatedGroupMember = await updateGroupMember(groupMemberId, {
    nickname: newNickname,
  });

  return updatedGroupMember;
}

export async function updateGroupMemberActiveStatus(
  groupMemberId: string,
  activeStatus: boolean,
) {
  const updatedGroupMember = await updateGroupMember(groupMemberId, {
    active: activeStatus,
    ...(!activeStatus && { leftAt: new Date() }), // if leaving group, update leftAt time
  });

  return updatedGroupMember;
}

export async function joinUserToGroup(userId: string, groupId: string) {
  const existingGroupMember = await getGroupMemberByUserIdAndGroupId(
    userId,
    groupId,
  );

  // groupMember already exists we just need to update their active status
  if (existingGroupMember) {
    const updatedGroupMember = await updateGroupMemberActiveStatus(
      existingGroupMember.id,
      true,
    );

    return updatedGroupMember;
  }

  const user = await getUserById(userId);
  if (!user) {
    //! THIS SHOULD REALLY NEVER BE HIT
    throw new Error(
      "MAJOR ERROR, TRYING TO CREATE NEW GROUPMEMBER WITH INVALID USERID",
    );
  }

  // groupMember does not exist, need to create new groupMember
  const newGroupMember = await createGroupMember({
    userId,
    groupId,
    nickname: user.email,
  });

  return newGroupMember;
}
