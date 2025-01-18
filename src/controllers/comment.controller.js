import { addCommentToAnswer } from "../services/comment.service.js";


export const handleCreateComment = async (req, res, next) => {
    /*
    #swagger.summary = '댓글 추가 API'
    #swagger.description = '특정 답변(answerId)에 댓글을 추가합니다.'
    #swagger.parameters['answerId'] = {
        in: 'path',
        description: '댓글을 추가할 답변의 ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            description: '댓글 내용',
                            example: '좋은 답변이네요!'
                        }
                    },
                    required: ['content']
                }
            }
        }
    }
    #swagger.responses[201] = {
        description: '댓글 추가 성공',
        schema: {
            resultType: 'SUCCESS',
            error: null,
            success: {
                id: 1,
                answerId: 1,
                userId: 2,
                content: '좋은 답변이네요!',
                createdAt: '2025-01-20T00:00:00.000Z',
                updatedAt: '2025-01-20T00:00:00.000Z'
            }
        }
    }
    #swagger.responses[400] = {
        description: '요청 데이터가 잘못됨',
        schema: {
            resultType: 'FAIL',
            error: 'answerId 또는 댓글 내용이 누락되었습니다.',
            success: null
        }
    }
    */
    try {
        const { content } = req.body;

        if (!content || !req.params.answerId) {
            return res.status(400).json({
                resultType: "FAIL",
                error: "answerId 또는 댓글 내용이 누락되었습니다.",
            });
        }
        const answerId = parseInt(req.params.answerId);



        if (!req.user || !req.user.id) {
            return res.status(401).json({
                resultType: "FAIL",
                error: "사용자 인증 정보가 누락되었습니다.",
            });
        }

        const userId = req.user.id;

        // 서비스 호출하여 댓글 추가
        const newComment = await addCommentToAnswer(userId, answerId, content);

        return res.status(201).json({
            resultType: "SUCCESS",
            error: null,
            success: newComment,
        });
    } catch (error) {
        console.error(error);
        next(error); // 에러 미들웨어로 전달
    }
};
