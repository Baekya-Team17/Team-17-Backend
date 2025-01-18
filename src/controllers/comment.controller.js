import { addCommentToAnswer } from "../services/comment.service.js";
import { getCommentsByAnswerId } from "../services/comment.service.js";


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


// controllers/comment.controller.js
export const handleGetComments = async (req, res, next) => {
    /*
    #swagger.summary = '특정 답변의 댓글 조회 API'
    #swagger.description = '특정 답변(answerId)에 대한 모든 댓글을 조회합니다.'
    #swagger.parameters['answerId'] = {
        in: 'path',
        description: '댓글을 조회할 답변의 ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: '댓글 조회 성공',
        schema: {
            resultType: 'SUCCESS',
            error: null,
            success: [
                {
                    id: 1,
                    answerId: 1,
                    userId: 2,
                    content: '좋은 답변입니다.',
                    createdAt: '2025-01-20T12:00:00.000Z',
                    updatedAt: '2025-01-20T12:00:00.000Z',
                    user: {
                        id: 2,
                        nickname: 'testUser'
                    }
                }
            ]
        }
    }
    #swagger.responses[404] = {
        description: '답변을 찾을 수 없음',
        schema: {
            resultType: 'FAIL',
            error: "해당 답변을 찾을 수 없습니다.",
            success: null
        }
    }
    */
    try {
        const answerId = parseInt(req.params.answerId);

        if (!answerId) {
            return res.status(400).json({
                resultType: "FAIL",
                error: "answerId가 필요합니다.",
            });
        }

        // 서비스 호출하여 댓글 조회
        const comments = await getCommentsByAnswerId(answerId);

        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: comments,
        });
    } catch (error) {
        console.error(error);
        next(error); // 에러 미들웨어로 전달
    }
};
