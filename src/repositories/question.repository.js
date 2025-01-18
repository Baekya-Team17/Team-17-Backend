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

export const linkQuestionToGroupInDb = async (questionId, groupId, childUserId) => {
    console.log("linkQuestionToGroupInDb 호출됨 - questionId:", questionId, "groupId:", groupId, "childUserId:", childUserId);

    try {
        const groupQuestion = await prisma.groupQuestion.create({
            data: {
                questionId,
                groupId,
                childUserId, // 자녀 ID를 기록
            },
        });

        console.log("groupQuestion 저장 완료:", groupQuestion);

        return groupQuestion;
    } catch (error) {
        console.error("linkQuestionToGroupInDb 에러:", error.message);
        throw new Error("그룹-질문 관계 생성 중 문제가 발생했습니다.");
    }
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

// 기본 질문 조회 (writerId와 writerGroupId가 null인 질문)
export const findDefaultQuestions = async () => {
    console.log("findDefaultQuestions repository 호출");

    try {
        const defaultQuestions = await prisma.question.findMany({
            where: {
                writerId: null,
                writerGroupId: null,
            },
            orderBy: {
                createdAt: "asc", // 정렬 기준
            },
        });

        return defaultQuestions;
    } catch (error) {
        console.error("findDefaultQuestions 에러:", error.message);
        throw new Error("기본 질문 조회 중 문제가 발생했습니다.");
    }
};

export const findRandomQuestion = async (groupId) => {
    console.log("findRandomQuestion 호출됨 - groupId:", groupId);

    try {
        const totalQuestions = await prisma.question.count({
            where: {
                OR: [
                    { writerGroupId: groupId }, // 특정 그룹 질문
                    { writerGroupId: null },   // 기본 질문
                ],
            },
        });

        console.log("총 질문 수:", totalQuestions);

        if (totalQuestions === 0) {
            console.log("질문이 없습니다.");
            return null;
        }

        const randomOffset = Math.floor(Math.random() * totalQuestions);
        console.log("랜덤 오프셋:", randomOffset);

        const randomQuestion = await prisma.question.findMany({
            where: {
                OR: [
                    { writerGroupId: groupId },
                    { writerGroupId: null },
                ],
            },
            take: 1,
            skip: randomOffset,
        });

        const selectedQuestion = randomQuestion[0];
        console.log("선택된 질문:", selectedQuestion);

        return selectedQuestion; // `writer_id`는 업데이트하지 않음
    } catch (error) {
        console.error("findRandomQuestion 에러:", error.message);
        throw new Error("랜덤 질문 조회 중 문제가 발생했습니다.");
    }
};






