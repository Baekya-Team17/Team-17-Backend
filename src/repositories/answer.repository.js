// repositories/answer.repository.js
import prisma from "../db.config.js";

// groupQuestionId로 groupQuestion 확인
export const findGroupQuestionById = async (groupQuestionId) => {
    return await prisma.groupQuestion.findUnique({
        where: {
            id: groupQuestionId,
        },
    });
};

// 답변 추가
export const createAnswerInDatabase = async (groupQuestionId, content) => {
    return await prisma.answer.create({
        data: {
            groupQuestionId: groupQuestionId,
            content: content,
        },
    });
};
