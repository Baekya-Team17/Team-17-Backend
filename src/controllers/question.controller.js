import {
    createQuestion,
    linkQuestionToGroup,
    getDefaultQuestions,
    getRandomQuestion
} from "../services/questions.service.js";

import {
    getRoleByUserIdAndGroupId,
    isUserInGroup
} from "../repositories/userGroup.repository.js";


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

        // groupId를 숫자로 변환
        const numericGroupId = parseInt(groupId, 10);
        if (isNaN(numericGroupId)) {
            return res.status(400).json({ error: "유효하지 않은 groupId입니다." });
        }

        // 그룹 유효성 검사
        const isGroupValid = await isUserInGroup(numericGroupId, userId);
        if (!isGroupValid) {
            return res.status(400).json({ error: "해당 그룹에 속해 있지 않습니다." });
        }

        // 사용자 역할 확인 (자녀만 질문 생성 가능)
        const role = await getRoleByUserIdAndGroupId(userId, numericGroupId);
        if (role !== "child") {
            return res.status(403).json({ error: "권한이 없습니다. 자녀만 질문을 생성할 수 있습니다." });
        }

        // 질문 생성
        const questionResponse = await createQuestion(userId, numericGroupId, content);

        // 생성된 질문을 GroupQuestion에 추가
        await linkQuestionToGroup(numericGroupId, questionResponse.id);

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

        // groupId와 questionId를 숫자로 변환
        const numericGroupId = parseInt(groupId, 10);
        const numericQuestionId = parseInt(questionId, 10);

        if (isNaN(numericGroupId) || isNaN(numericQuestionId)) {
            return res.status(400).json({ error: "유효하지 않은 groupId 또는 questionId입니다." });
        }

        // 그룹과 기존 질문 연결
        const groupQuestion = await linkQuestionToGroup(numericGroupId, numericQuestionId);
        res.status(201).json({
            message: "기존 질문이 그룹에 성공적으로 연결되었습니다.",
            groupQuestion,
        });
    } catch (error) {
        console.error("기존 질문 연결 중 에러:", error.message);
        next(error);
    }
};

// 기본 질문 반환 컨트롤러
export const handleGetDefaultQuestions = async (req, res, next) => {
    try {
        console.log("라우터: GET /questions/default 호출");

        // 기본 질문 가져오기 (writer_id와 writer_group_id가 null인 질문)
        const defaultQuestions = await getDefaultQuestions();

        if (!defaultQuestions || defaultQuestions.length === 0) {
            return res.status(404).json({ error: "기본 질문이 없습니다." });
        }

        res.status(200).json({ questions: defaultQuestions });
    } catch (error) {
        console.error("기본 질문 반환 중 에러:", error.message);
        next(error);
    }
};

// 랜덤 질문 반환 컨트롤러
export const handleGetRandomQuestion = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        // 자녀의 userId 가져오기
        const { id: userId } = req.user; // 인증 미들웨어에서 req.user를 설정했다고 가정

        if (!groupId) {
            return res.status(400).json({ error: "groupId는 필수 입력 항목입니다." });
        }

        const numericGroupId = parseInt(groupId, 10);
        if (isNaN(numericGroupId)) {
            return res.status(400).json({ error: "유효하지 않은 groupId입니다." });
        }

        // 랜덤 질문 가져오기 (userId도 전달)
        const question = await getRandomQuestion(numericGroupId, userId);

        if (!question) {
            return res.status(404).json({ error: "그룹에 질문이 없습니다." });
        }

        res.status(200).json({ question });
    } catch (error) {
        console.error("handleGetRandomQuestion 에러:", error.message);
        next(error);
    }
};



