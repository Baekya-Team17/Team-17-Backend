import {
    createQuestionInDb,
    linkQuestionToGroupInDb,
    findQuestionById,
    findQuestionsByGroupId,
    findDefaultQuestions,
    findRandomQuestion
} from "../repositories/question.repository.js";

// 새로운 질문 생성
export const createQuestion = async (userId, groupId, content) => {
    console.log("createQuestion service 호출");

    // repository 계층의 createQuestionInDb 호출
    const question = await createQuestionInDb(content, userId, groupId);

    return question;
};

// 그룹-질문 관계 생성
export const linkQuestionToGroup = async (groupId, questionId) => {
    console.log("linkQuestionToGroup service 호출");

    try {
        // repository 계층의 linkQuestionToGroupInDb 호출
        const groupQuestion = await linkQuestionToGroupInDb(questionId, groupId);

        return groupQuestion;
    } catch (error) {
        console.error("linkQuestionToGroup 에러:", error.message);
        throw new Error("기존 질문을 그룹에 연결하는 데 실패했습니다.");
    }
};

// 특정 질문 조회 (Optional)
export const getQuestionById = async (questionId) => {
    console.log("getQuestionById 호출");

    const question = await findQuestionById(questionId);
    if (!question) {
        throw new Error("해당 ID의 질문을 찾을 수 없습니다.");
    }

    return question;
};

// 특정 그룹에 연결된 질문 리스트 조회 (Optional)
export const getQuestionsByGroupId = async (groupId) => {
    console.log("getQuestionsByGroupId 호출");

    const questions = await findQuestionsByGroupId(groupId);
    return questions;
};


// 기본 질문 반환 서비스
export const getDefaultQuestions = async () => {
    console.log("getDefaultQuestions service 호출");

    try {
        const defaultQuestions = await findDefaultQuestions(); // Repository 호출
        return defaultQuestions;
    } catch (error) {
        console.error("getDefaultQuestions 에러:", error.message);
        throw new Error("기본 질문 반환 중 문제가 발생했습니다.");
    }
};

// 랜덤 질문 서비스
export const getRandomQuestion = async (groupId, userId) => {
    console.log("getRandomQuestionAndLinkToParentGroup 호출됨 - groupId:", groupId, "userId:", userId);

    // 랜덤 질문 가져오기
    const randomQuestion = await findRandomQuestion(groupId);

    if (!randomQuestion) {
        throw new Error("그룹에 랜덤 질문이 없습니다.");
    }

    // groupQuestion 테이블에 관계 저장 (writer_id는 업데이트하지 않음)
    const groupQuestion = await linkQuestionToGroupInDb(randomQuestion.id, groupId, userId);

    return { randomQuestion, groupQuestion };
};