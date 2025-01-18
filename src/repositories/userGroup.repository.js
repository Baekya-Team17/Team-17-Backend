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