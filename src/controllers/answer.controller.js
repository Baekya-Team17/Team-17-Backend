import { addAnswerToGroupQuestion } from "../services/answer.service.js";
import { getGroupQuestionsWithAnswers } from "../services/answer.service.js";

export const handleCreateAnswer = async (req, res, next) => {
    /*
    #swagger.summary = '답변 추가 API'
    #swagger.description = 'groupQuestionId를 기반으로 요청한 유저가 답변을 추가합니다.'
    #swagger.parameters['groupQuestionId'] = {
        in: 'path',
        description: '답변을 추가할 groupQuestion의 ID',
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
                            description: '답변 내용',
                            example: '이 답변은 테스트 데이터입니다.'
                        }
                    },
                    required: ['content']
                }
            }
        }
    }
    #swagger.responses[201] = {
        description: '답변 추가 성공',
        schema: {
            resultType: 'SUCCESS',
            error: null,
            success: {
                id: 1,
                groupQuestionId: 1,
                userId: 2,
                content: '이 답변은 테스트 데이터입니다.',
                createdAt: '2025-01-20T12:00:00.000Z',
                updatedAt: '2025-01-20T12:00:00.000Z'
            }
        }
    }
    #swagger.responses[400] = {
        description: '요청 데이터가 잘못됨',
        schema: {
            resultType: 'FAIL',
            error: 'groupQuestionId 또는 답변 내용이 누락되었습니다.',
            success: null
        }
    }
    */
    try {
        const groupQuestionId = parseInt(req.params.groupQuestionId);
        const { content } = req.body;

        if (!groupQuestionId || !content) {
            return res.status(400).json({
                resultType: "FAIL",
                error: "groupQuestionId 또는 답변 내용이 누락되었습니다.",
            });
        }

        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({
        //         resultType: "FAIL",
        //         error: "사용자 인증 정보가 누락되었습니다.",
        //     });
        // }

        // const userId = req.user.id;

        // 서비스 호출하여 답변 추가
        const newAnswer = await addAnswerToGroupQuestion(groupQuestionId, content);

        return res.status(201).json({
            resultType: "SUCCESS",
            error: null,
            success: newAnswer,
        });
    } catch (error) {
        console.error(error);
        next(error); // 에러 미들웨어로 전달
    }
};


// controllers/groupQuestion.controller.js
export const handleGetGroupQuestionList = async (req, res, next) => {
    /*
    #swagger.summary = '그룹의 질문 리스트와 답변 조회 API'
    #swagger.description = '특정 그룹(groupId)의 질문 리스트와 각 질문의 답변을 조회합니다.'
    #swagger.parameters['groupId'] = {
        in: 'path',
        description: '조회할 그룹의 ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: '그룹의 질문과 답변 조회 성공',
        schema: {
            resultType: 'SUCCESS',
            error: null,
            success: [
                {
                    id: 1,
                    groupId: 1,
                    questionId: 1,
                    createdAt: '2025-01-20T12:00:00.000Z',
                    updatedAt: '2025-01-20T12:00:00.000Z',
                    question: {
                        id: 1,
                        content: '이 질문은 테스트 질문입니다.',
                        createdAt: '2025-01-20T12:00:00.000Z',
                        updatedAt: '2025-01-20T12:00:00.000Z'
                    },
                    answers: [
                        {
                            id: 1,
                            userId: 2,
                            content: '이 답변은 테스트 데이터입니다.',
                            createdAt: '2025-01-20T12:00:00.000Z',
                            updatedAt: '2025-01-20T12:00:00.000Z',
                            user: {
                                id: 2,
                                nickname: 'testUser'
                            }
                        }
                    ]
                }
            ]
        }
    }
    */
    try {
        const groupId = parseInt(req.params.groupId);

        if (!groupId) {
            return res.status(400).json({
                resultType: "FAIL",
                error: "groupId가 필요합니다.",
            });
        }

        // 서비스 호출하여 질문 및 답변 조회
        const groupQuestions = await getGroupQuestionsWithAnswers(groupId);

        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: groupQuestions,
        });
    } catch (error) {
        console.error(error);
        next(error); // 에러 미들웨어로 전달
    }
};
