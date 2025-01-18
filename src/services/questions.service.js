import { prisma } from "../db.config.js";

export const createQuestion = async (userId, groupId, content) => {
    console.log("createQuestion service 호출");

    // 새로운 질문 생성
    const question = await prisma.question.create({
        data: {
            content,
            writerId: userId,
            writerGroupId: groupId
        }
    });

    return question;
};

export const linkQuestionToGroup = async (groupId, questionId) => {
    console.log("linkQuestionToGroup service 호출");

    try {
        const groupQuestion = await prisma.groupQuestion.create({
            data: {
                groupId: parseInt(groupId), // groupId를 숫자로 변환
                questionId: parseInt(questionId), // questionId를 숫자로 변환
            },
        });

        return groupQuestion;
    } catch (error) {
        console.error("linkQuestionToGroup 에러:", error.message);
        throw new Error("기존 질문을 그룹에 연결하는 데 실패했습니다.");
    }
};



