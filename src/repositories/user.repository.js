import { prisma } from '../db.config.js'


// nickname으로 사용자 정보 가져오기
export const findUserByNickname = async (nickname) => {
    return await prisma.user.findUnique({
        where: {
            nickname, // user.nickname을 기준으로 검색
        },
    });
};