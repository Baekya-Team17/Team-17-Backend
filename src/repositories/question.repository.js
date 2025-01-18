import { prisma } from "../db.config.js";

// 새로운 질문 생성
export const createQuestionInDb = async (content, userId, groupId) => {
    return await prisma.question.create({
        data: {
            content,
            writerId: userId,
            writerGroupId: groupId,
        },
    });
};

// 그룹-질문 관계 생성
export const linkQuestionToGroupInDb = async (questionId, groupId) => {
    return await prisma.groupQuestion.create({
        data: {
            questionId,
            groupId,
        },
    });
};

// 특정 질문 조회 (Optional: 특정 검증 로직에 사용 가능)
export const findQuestionById = async (questionId) => {
    return await prisma.question.findUnique({
        where: { id: questionId },
    });
};

// 특정 그룹에 연결된 질문 리스트 조회 (Optional)
export const findQuestionsByGroupId = async (groupId) => {
    return await prisma.groupQuestion.findMany({
        where: { groupId },
        include: { question: true },
    });
};
