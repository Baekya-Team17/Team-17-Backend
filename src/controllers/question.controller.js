import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createQuestion = async (req, res) => {
    const { content, groupId } = req.body; // 요청에서 질문 내용과 그룹 ID 가져오기
    const userId = req.user.id; // 인증된 사용자 ID (JWT를 통해 가져온 값)

    try {
        // 1. 자식 사용자가 해당 그룹에 속해 있는지 확인
        const userGroup = await prisma.userGroup.findFirst({
            where: {
                userId, // 사용자의 ID
                groupId, // 요청된 그룹 ID
                roleInGroup: "child", // 역할이 child인지 확인
            },
        });

        if (!userGroup) {
            return res.status(403).json({ message: "해당 그룹에서 질문할 권한이 없습니다." });
        }

        // 2. 질문 생성
        const question = await prisma.question.create({
            data: {
                content,
                writerId: userId, // 작성자 ID 저장
            },
        });

        // 3. 응답 반환
        res.status(201).json({
            message: "질문이 성공적으로 생성되었습니다.",
            question,
        });
    } catch (error) {
        console.error("질문 생성 에러:", error);
        res.status(500).json({ message: "질문 생성 중 에러가 발생했습니다." });
    }
};
