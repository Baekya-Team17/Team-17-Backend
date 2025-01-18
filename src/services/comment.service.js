// services/comment.service.js
import { findAnswerById, createCommentInDatabase, findCommentsByAnswerId } from "../repositories/comment.repository.js";

export const addCommentToAnswer = async (userId, answerId, content) => {
    // 답변(answerId)이 존재하는지 확인
    const answer = await findAnswerById(answerId);
    if (!answer) {
        throw new Error("댓글을 추가할 답변을 찾을 수 없습니다.");
    }

    // 데이터베이스에 댓글 추가
    const newComment = await createCommentInDatabase(userId, answerId, content);

    return {
        id: newComment.id,
        answerId: newComment.answerId,
        userId: newComment.userId,
        content: newComment.content,
        createdAt: newComment.createdAt,
        updatedAt: newComment.updatedAt,
    };
};

export const getCommentsByAnswerId = async (answerId) => {
    // 답변(answerId)이 존재하는지 확인
    const answer = await findAnswerById(answerId);
    if (!answer) {
        throw new Error("해당 답변을 찾을 수 없습니다.");
    }

    // 답변에 대한 댓글 조회
    const comments = await findCommentsByAnswerId(answerId);

    return comments.map((comment) => ({
        id: comment.id,
        answerId: comment.answerId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
            id: comment.user.id,
            nickname: comment.user.nickname,
        },
    }));
};

