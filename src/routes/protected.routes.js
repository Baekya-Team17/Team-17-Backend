import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "This is a protected route",
        user: req.user, // 토큰에 포함된 사용자 정보
    });
});

export default router;
