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


export const joinGroup = async (userId, groupId, roleInGroup) => {
    // 그룹에 이미 가입되어 있는지 확인
    const isAlreadyInGroup = await isUserInGroup(groupId, userId);
    if (isAlreadyInGroup) {
        throw new Error("사용자는 이미 이 그룹에 가입되어 있습니다.");
    }

    // 그룹에 사용자 추가
    const newUserGroup = await addUserToGroup(groupId, userId, roleInGroup);

    return {
        id: newUserGroup.id,
        groupId: newUserGroup.groupId,
        userId: newUserGroup.userId,
        roleInGroup: newUserGroup.roleInGroup,
        isCreator: newUserGroup.isCreator,
    };
};