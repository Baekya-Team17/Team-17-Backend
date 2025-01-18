import { createQuestion, linkQuestionToGroup } from "../services/questions.service.js";
import { getRoleByUserIdAndGroupId } from "../repositories/userGroup.repository.js";
import { isUserInGroup } from "../repositories/userGroup.repository.js";

// 새로운 질문 생성 컨트롤러
export const handleCreateQuestion = async (req, res, next) => {
    try {
        console.log("req.user:", req.user);
        console.log("req.body:", req.body);

        // 사용자 인증 정보 검증
        if (!req.user || !req.user.id) {
            return res.status(403).json({ error: "인증 정보가 누락되었습니다. 로그인 후 다시 시도해주세요." });
        }

        const { id: userId } = req.user;
        const { content, groupId } = req.body;

        // 요청 본문 검증
        if (!content || !groupId) {
            return res.status(400).json({ error: "content와 groupId는 필수 입력 항목입니다." });
        }

        // 그룹 유효성 검사
        const isGroupValid = await isUserInGroup(groupId, userId);
        if (!isGroupValid) {
            return res.status(400).json({ error: "해당 그룹에 속해 있지 않습니다." });
        }

        // 사용자 역할 확인 (자녀만 질문 생성 가능)
        const role = await getRoleByUserIdAndGroupId(userId, groupId);
        if (role !== "child") {
            return res.status(403).json({ error: "권한이 없습니다. 자녀만 질문을 생성할 수 있습니다." });
        }

        // 질문 생성
        const questionResponse = await createQuestion(userId, groupId, content);
        res.status(201).json({
            message: "질문이 성공적으로 생성되었습니다.",
            question: questionResponse,
        });
    } catch (error) {
        console.error("질문 생성 중 에러:", error.message);
        next(error);
    }
};


// 기존 질문 연결 컨트롤러
export const handleLinkExistingQuestion = async (req, res, next) => {
    try {
        console.log("라우터: POST /groups/:groupId/questions 호출");
        console.log("req.body:", req.body);
        console.log("req.params:", req.params);

        const { questionId } = req.body;
        const { groupId } = req.params;

        // 요청 검증
        if (!questionId || !groupId) {
            return res.status(400).json({ error: "questionId와 groupId는 필수 입력 항목입니다." });
        }

        // 그룹과 기존 질문 연결
        const groupQuestion = await linkQuestionToGroup(groupId, questionId);
        res.status(201).json({
            message: "기존 질문이 그룹에 성공적으로 연결되었습니다.",
            groupQuestion,
        });
    } catch (error) {
        console.error("기존 질문 연결 중 에러:", error.message);
        next(error);
    }
};


