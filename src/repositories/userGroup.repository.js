import { prisma } from '../db.config.js'

export const createUserGroup = async (userId, groupId, roleInGroup) => {

    const userGroup = await prisma.userGroup.create({
        data: {
            userId,
            groupId,
            roleInGroup,
            isCreator: true
        }
    })
    return userGroup;
}


export const getUserGroupsByUserId = async (userId) => {
    return await prisma.userGroup.findMany({
        where: {
            userId: userId,
        },
        include: {
            group: true, // 연관된 Group 데이터 포함
        },
    });
};

export const isUserInGroup = async (groupId, userId) => {
    const userGroup = await prisma.userGroup.findFirst({
        where: { groupId: groupId, userId: userId },
    });

    return !!userGroup; // 해당 관계가 존재하면 true 반환, 그렇지 않으면 false
};



export const getRoleByUserIdAndGroupId = async (userId, groupId) => {
    const userGroup = await prisma.userGroup.findFirst({
        where: { userId: userId, groupId: groupId }, // 필드 이름 수정
    });

    return userGroup ? userGroup.roleInGroup : null; // Prisma 모델의 필드 이름 확인
};