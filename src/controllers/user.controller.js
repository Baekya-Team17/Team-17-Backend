import prisma from "../db.config.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils.js";

export const registerUser = async (req, res) => {
    const { nickname, email, password, name } = req.body;

    try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 중복된 userId 확인
        const existingUser = await prisma.user.findUnique({
            where: { nickname },
        });
        if (existingUser) {
            return res.status(400).json({ error: "User ID already in use" });
        }

        // 사용자 생성
        const user = await prisma.user.create({
            data: {
                nickname, // 사용자가 입력한 userId
                email,
                password: hashedPassword,
                name,
            },
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({ error: "Failed to register user", details: err.message });
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                userGroups: {
                    select: {
                        groupId: true,
                        roleInGroup: true,
                    },
                },
            },
        });

        if (!user) {
            console.error("User not found:", email);
            return res.status(404).json({ error: "User not found" });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Invalid credentials for user:", email);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("Generating token for user ID:", user.id);
        const token = generateToken(user.id);

        // 5. 유저의 그룹 정보 준비
        const groupInfo = user.userGroups.map((group) => ({
            groupId: group.groupId,
            roleInGroup: group.roleInGroup,
        }));

        res.status(200).json({ token, groupInfo });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Failed to login user", details: err.message });
    }
};

