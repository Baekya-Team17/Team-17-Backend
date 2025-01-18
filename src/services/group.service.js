import { createGroup, isGroupCreator, addUserToGroup, isUserInGroup } from "../repositories/group.repository.js";
import { createUserGroup } from "../repositories/userGroup.repository.js";
import { responseFromCreateGroup } from "../dtos/group.dto.js";
import { getUserGroupsByUserId } from "../repositories/userGroup.repository.js";
import { findUserByNickname } from "../repositories/user.repository.js";

export const groupCreate = async (userId, roleInGroup) => {
    console.log("groupCreate service");

    //그룹 생성 
    const groupId = await createGroup();

    // 그룹과 유저 연결 (유저그룹에 데이터 추가)
    const userGroup = await createUserGroup(userId, groupId, roleInGroup);


    return responseFromCreateGroup(userGroup)
}


export const getUserGroups = async (userId) => {
    if (!userId) {
        throw new Error("사용자 ID가 필요합니다.");
    }

    // 레퍼지토리에서 사용자 그룹 데이터 가져오기
    const userGroups = await getUserGroupsByUserId(userId);

    if (!userGroups || userGroups.length === 0) {
        return []; // 그룹이 없는 경우 빈 배열 반환
    }

    return userGroups;
};


export const inviteUserToGroup = async (requestingUserId, groupId, inviteUserNickname, roleInGroup) => {
    // 그룹 생성자인지 확인
    const isCreator = await isGroupCreator(requestingUserId, groupId);
    if (!isCreator) {
        throw new Error("해당 그룹의 생성자만 사용자를 초대할 수 있습니다.");
    }

    // 초대할 사용자 정보 확인 (nickname 기반)
    const invitedUser = await findUserByNickname(inviteUserNickname);
    if (!invitedUser) {
        throw new Error("초대하려는 사용자가 존재하지 않습니다.");
    }


    // 그룹에 이미 속해 있는지 확인
    const isAlreadyInGroup = await isUserInGroup(groupId, invitedUser.id);
    if (isAlreadyInGroup) {
        throw new Error(`사용자(${inviteUserNickname})는 이미 이 그룹에 속해 있습니다.`);
    }

    // 그룹에 사용자 추가
    const newUserGroup = await addUserToGroup(groupId, invitedUser.id, roleInGroup);

    return {
        inviteUserId: newUserGroup.userId,
        groupId: newUserGroup.groupId,
        roleInGroup: newUserGroup.roleInGroup,
        isCreator: newUserGroup.isCreator
    }; // 추가된 사용자-그룹 관계 반환
};
