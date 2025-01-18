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