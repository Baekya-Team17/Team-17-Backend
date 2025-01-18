
import prisma from "../db.config.js"



// 답변이 존재하는지 확인
export const findAnswerById = async (answerId) => {
    return await prisma.answer.findUnique({
        where: {
            id: answerId,
        },
    });
};

// 댓글 추가
export const createCommentInDatabase = async (userId, answerId, content) => {
    return await prisma.comment.create({
        data: {
            userId: userId,
            answerId: answerId,
            content: content,
        },
    });
};


// 특정 답변에 대한 댓글 조회
export const findCommentsByAnswerId = async (answerId) => {
    return await prisma.comment.findMany({
        where: {
            answerId: answerId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true, // 댓글 작성자 정보 포함
                },
            },
        },
    });
};
