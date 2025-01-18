// services/answer.service.js
import { findGroupQuestionById, createAnswerInDatabase } from "../repositories/answer.repository.js";

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
