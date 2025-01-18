// import express from "express";
// // import { createQuestion } from "../controllers/question.controller.js";
// // import { authMiddleware } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Questions
//  *   description: API to manage questions
//  */

// /**
//  * @swagger
//  * /questions:
//  *   post:
//  *     summary: Create a new question
//  *     tags: [Questions]
//  *     security:
//  *       - bearerAuth: []  # 인증이 필요한 엔드포인트
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - content
//  *               - groupId
//  *             properties:
//  *               content:
//  *                 type: string
//  *                 description: The content of the question
//  *               groupId:
//  *                 type: integer
//  *                 description: The group ID where the question is created
//  *     responses:
//  *       201:
//  *         description: Question created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 question:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                     content:
//  *                       type: string
//  *                     writerId:
//  *                       type: integer
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *       403:
//  *         description: User does not have permission to create a question in this group
//  *       500:
//  *         description: Internal server error
//  */
// router.post("/questions", authMiddleware, createQuestion);

// export default router;
