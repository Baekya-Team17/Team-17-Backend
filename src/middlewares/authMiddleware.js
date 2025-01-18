import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>" 형식에서 토큰 추출

    if (!token) {
        return res.status(401).json({ error: "Access denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 토큰에서 디코딩된 사용자 정보
        next(); // 다음 미들웨어 또는 라우트로 진행
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
};
