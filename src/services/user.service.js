import { prisma } from '../db.config.js'

export const getUserByEmail = async (email) => {
    if (!email) {
        throw new Error("이메일이 필요합니다.");
    }

    // 이메일로 사용자 조회
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user;
};