import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
};

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token); // 토큰 검증
        if (!decoded) {
            return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
        }
        req.user = decoded; // req.user에 사용자 정보 저장
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(403).json({ message: "토큰 검증 중 오류가 발생했습니다." });
    }
};