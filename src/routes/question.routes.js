import express from "express";
import {
    handleCreateQuestion,
    handleLinkExistingQuestion,
    handleGetDefaultQuestions, // 기본 질문 컨트롤러 추가
    handleGetRandomQuestion,
} from "../controllers/question.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: 새로운 질문 생성
 *     description: 자녀가 새로운 질문을 생성합니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "질문 제목"
 *               content:
 *                 type: string
 *                 example: "질문 내용"
 *     responses:
 *       201:
 *         description: 성공적으로 질문이 생성됨
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */
router.post("/question", authenticateToken, (req, res) => {
    if (process.env.NODE_ENV === "development") {
        console.log("라우터: POST /questions 호출");
        console.log("요청 본문:", req.body);
        console.log("사용자 정보:", req.user);
    }
    handleCreateQuestion(req, res);
});

/**
 * @swagger
 * /questions/groups/{groupId}:
 *   post:
 *     summary: 그룹에 기존 질문 연결
 *     description: 기존 질문을 특정 그룹과 연결합니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           example: "123"
 *         description: 연결할 그룹 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: "456"
 *     responses:
 *       200:
 *         description: 성공적으로 질문이 그룹과 연결됨
 *       404:
 *         description: 그룹 또는 질문을 찾을 수 없음
 *       401:
 *         description: 인증 실패
 */
router.post("/question/groups/:groupId", authenticateToken, (req, res) => {
    if (process.env.NODE_ENV === "development") {
        console.log("라우터: POST /groups/:groupId/questions 호출");
        console.log("요청 본문:", req.body);
        console.log("사용자 정보:", req.user);
    }
    handleLinkExistingQuestion(req, res);
});

/**
 * @swagger
 * /questions/groups/{groupId}/priority:
 *   get:
 *     summary: 우선순위 질문 조회
 *     description: 부모가 답변할 우선순위 질문을 조회합니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 그룹 ID
 *     responses:
 *       200:
 *         description: 우선순위 질문 반환
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 우선순위 질문 없음
 */
router.get("/question/groups/:groupId/priority", authenticateToken, (req, res) => {
    handleGetPriorityQuestion(req, res);
});

/**
 * @swagger
 * /questions/default:
 *   get:
 *     summary: 기본 질문 반환
 *     description: 웹에서 제공하는 기본 질문 목록을 반환합니다.
 *     tags:
 *       - Questions
 *     responses:
 *       200:
 *         description: 기본 질문 목록 반환 성공
 *       404:
 *         description: 기본 질문이 없음
 */
router.get("/questions/default", authenticateToken ,(req, res) => {
    if (process.env.NODE_ENV === "development") {
        console.log("라우터: GET /questions/default 호출");
    }
    handleGetDefaultQuestions(req, res);
});

/**
 * @swagger
 * /questions/groups/{groupId}/random:
 *   get:
 *     summary: 랜덤 질문 반환
 *     description: 특정 그룹의 질문 중 하나를 랜덤하게 반환합니다.
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 그룹 ID
 *     responses:
 *       200:
 *         description: 랜덤 질문 반환 성공
 *       404:
 *         description: 그룹에 질문이 없음
 */
router.get("/questions/groups/:groupId/random", authenticateToken, (req, res) => {
    handleGetRandomQuestion(req, res);
});

export default router;

