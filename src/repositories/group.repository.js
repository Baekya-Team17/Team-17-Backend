import { prisma } from '../db.config.js'

export const createGroup = async () => {
    const group = await prisma.group.create({ data: {} });

    return group.id
}


// 그룹의 생성자인지 확인
export const isGroupCreator = async (userId, groupId) => {
    const userGroup = await prisma.userGroup.findFirst({
        where: {
            userId,
            groupId,
            isCreator: true,
        },
    });
    return !!userGroup; // 생성자이면 true 반환
};

// 그룹에 사용자 추가
export const addUserToGroup = async (groupId, userId, roleInGroup) => {
    return await prisma.userGroup.create({
        data: {
            groupId,
            userId,
            roleInGroup,
            isCreator: false, // 초대된 유저는 생성자가 아님
        },
    });
};

//사용자가 그룹에 이미 속해 있는지 확인 
export const isUserInGroup = async (groupId, userId) => {
    const existingUserGroup = await prisma.userGroup.findFirst({
        where: {
            groupId,
            userId,
        },
    });
    return !!existingUserGroup; // 관계가 존재하면 true 반환
};