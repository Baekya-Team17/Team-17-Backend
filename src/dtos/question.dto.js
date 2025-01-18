// 새로운 질문 생성 응답 DTO
export const responseFromCreateQuestion = (question) => {
    return {
        id: question.id,
        content: question.content,
        writerId: question.writerId,
        writerGroupId: question.writerGroupId,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
    };
};

// 그룹-질문 관계 생성 응답 DTO
export const responseFromLinkQuestionToGroup = (groupId, questionId) => {
    return {
        groupId,
        questionId,
        message: "질문이 그룹에 연결되었습니다.",
    };
};
