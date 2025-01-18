import { prisma } from '../db.config.js'

export const createGroup = async () => {
    const group = await prisma.group.create({ data: {} });

    return group.id
}
