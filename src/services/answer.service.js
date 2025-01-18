// services/answer.service.js
import { findGroupQuestionById, createAnswerInDatabase } from "../repositories/answer.repository.js";
import { findGroupQuestionsWithAnswers } from "../repositories/answer.repository.js";

export const addAnswerToGroupQuestion = async (groupQuestionId, content) => {
    // groupQuestionId가 존재하는지 확인
    const groupQuestion = await findGroupQuestionById(groupQuestionId);
    if (!groupQuestion) {
        throw new Error("해당 groupQuestion을 찾을 수 없습니다.");
    }

    // 답변 데이터 추가
    const newAnswer = await createAnswerInDatabase(groupQuestionId, content);

    return {
        id: newAnswer.id,
        groupQuestionId: newAnswer.groupQuestionId,
        content: newAnswer.content,
        createdAt: newAnswer.createdAt,
        updatedAt: newAnswer.updatedAt,
    };
};



export const getGroupQuestionsWithAnswers = async (groupId) => {
    // 그룹의 질문과 답변 조회
    const groupQuestions = await findGroupQuestionsWithAnswers(groupId);

    return groupQuestions.map((groupQuestion) => ({
        id: groupQuestion.id,
        groupId: groupQuestion.groupId,
        questionId: groupQuestion.questionId,
        createdAt: groupQuestion.createdAt,
        updatedAt: groupQuestion.updatedAt,
        question: {
            id: groupQuestion.question.id,
            content: groupQuestion.question.content,
            createdAt: groupQuestion.question.createdAt,
            updatedAt: groupQuestion.question.updatedAt,
        },
        answers: groupQuestion.answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
        })),
    }));
};
