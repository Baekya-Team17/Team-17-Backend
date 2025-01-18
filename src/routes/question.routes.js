import express from "express";
import {
    handleCreateQuestion,
    handleLinkExistingQuestion
} from "../controllers/question.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 인증 미들웨어 적용
router.use(authenticateToken); // 모든 라우트에 대해 인증을 수행

/**
 * @route POST /questions
 * @desc 자녀가 새로운 질문을 생성합니다.
 * @access Child only
 */
router.post("/questions", (req, res, next) => {
    console.log("라우터: POST /questions 호출");
    console.log("요청 본문:", req.body);
    console.log("사용자 정보:", req.user); // 사용자 정보가 미들웨어에서 설정된 경우
    next(); // 다음 미들웨어(컨트롤러)로 전달
}, handleCreateQuestion);

/**
 * @route POST /groups/:groupId/questions
 * @desc 기존 질문을 특정 그룹과 연결합니다.
 * @access Child only
 */
router.post("/groups/:groupId/questions", (req, res, next) => {
    console.log("라우터: POST /groups/:groupId/questions 호출");
    console.log("요청 본문:", req.body);
    console.log("사용자 정보:", req.user); // 사용자 정보가 미들웨어에서 설정된 경우
    next();
}, handleLinkExistingQuestion);

export default router;

