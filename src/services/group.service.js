import { createGroup } from "../repositories/group.repository.js";
import { createUserGroup } from "../repositories/userGroup.repository.js";
import { responseFromCreateGroup } from "../dtos/group.dto.js";
import { getUserGroupsByUserId } from "../repositories/userGroup.repository.js";

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