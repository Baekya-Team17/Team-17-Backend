import { createGroup } from "../repositories/group.repository.js";
import { createUserGroup } from "../repositories/userGroup.repository.js";
import { responseFromCreateGroup } from "../dtos/group.dto.js";

export const groupCreate = async (userId, roleInGroup) => {
    console.log("groupCreate service");

    //그룹 생성 
    const groupId = await createGroup();

    // 그룹과 유저 연결 (유저그룹에 데이터 추가)
    const userGroup = await createUserGroup(userId, groupId, roleInGroup);





    return responseFromCreateGroup(userGroup)
}