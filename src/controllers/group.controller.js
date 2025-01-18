import { groupCreate } from "../services/group.service.js";
import { getUserGroups } from "../services/group.service.js";
import { joinGroup } from "../services/group.service.js";
import { getUserByEmail } from "../services/user.service.js";

export const handleCreateGroup = async (req, res, next) => {
    /*
#swagger.summary = '그룹 생성 API'
#swagger.requestBody = {
    required: true,
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    roleInGroup: {
                        type: 'string',
                        enum: ['parent', 'child'],
                        description: '그룹 내 역할 (parent 또는 child)',
                        example: 'child'
                    }
                },
                required: ['roleInGroup']
            }
        }
    }
}
#swagger.responses[201] = {
    description: '사용자-그룹 관계 생성 성공',
    schema: {
        resultType: 'SUCCESS',
        error: null,
        success: {
            userId: 1,
            groupId: 3,
            roleInGroup: 'child',
            isCreator: true
        }
    }
}
*/

    console.log('그룹생성 요청');

    const userId = req.body.userId;


    const roleInGroup = req.body.roleInGroup;

    const group = await groupCreate(userId, roleInGroup);

    res.success(group);
}
export const handleListGroupsByEmail = async (req, res, next) => {
    /*
#swagger.summary = '이메일로 사용자 그룹 조회 API'
#swagger.description = '쿼리스트링으로 이메일을 전달하면 해당 이메일 사용자의 그룹을 조회합니다. 인증 토큰 없이 동작합니다.'
#swagger.parameters['email'] = {
    in: 'query',
    description: '조회할 사용자의 이메일',
    required: true,
    type: 'string',
    example: 'test@example.com'
}
#swagger.responses[200] = {
    description: '사용자 그룹 조회 성공',
    schema: {
        resultType: 'SUCCESS',
        error: null,
        success: [
            {
                id: 1,
                groupName: "Sample Group",
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-02T00:00:00.000Z"
            }
        ]
    }
}
#swagger.responses[404] = {
    description: '해당 이메일의 사용자를 찾을 수 없음',
    schema: {
        resultType: 'FAIL',
        error: "해당 이메일의 사용자를 찾을 수 없습니다.",
        success: null
    }
}
    */
    try {
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({
                resultType: "FAIL",
                error: "이메일이 필요합니다.",
            });
        }

        // 이메일로 사용자 조회
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                resultType: "FAIL",
                error: "해당 이메일의 사용자를 찾을 수 없습니다.",
            });
        }

        const userGroups = await getUserGroups(user.id);

        return res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: userGroups,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            resultType: "FAIL",
            error: error.message,
        });
    }
};

export const handleListGroupsByToken = async (req, res, next) => {
    /*
#swagger.summary = '인증된 사용자 그룹 조회 API'
#swagger.description = '인증 토큰을 사용해 로그인된 사용자의 그룹 정보를 조회합니다.'
#swagger.responses[200] = {
    description: '사용자 그룹 조회 성공',
    schema: {
        resultType: 'SUCCESS',
        error: null,
        success: [
            {
                id: 1,
                groupName: "Sample Group",
                createdAt: "2025-01-01T00:00:00.000Z",
                updatedAt: "2025-01-02T00:00:00.000Z"
            }
        ]
    }
}
#swagger.responses[401] = {
    description: '사용자 인증 정보가 누락됨',
    schema: {
        resultType: 'FAIL',
        error: "사용자 인증 정보가 누락되었습니다.",
        success: null
    }
}
    */

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                resultType: "FAIL",
                error: "사용자 인증 정보가 누락되었습니다.",
            });
        }

        const userGroups = await getUserGroups(req.user.id);

        return res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: userGroups,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            resultType: "FAIL",
            error: error.message,
        });
    }
};

export const handleJoinGroup = async (req, res, next) => {
    /*
    #swagger.summary = '그룹 가입 API'
    #swagger.description = 'API를 요청한 사용자가 요청에 포함된 groupId의 그룹에 가입합니다.'
    #swagger.parameters['groupId'] = {
        in: 'path',
        description: '가입할 그룹의 ID',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        roleInGroup: {
                            type: 'string',
                            enum: ['parent', 'child'],
                            description: '그룹 내 역할',
                            example: 'child'
                        }
                    },
                    required: ['roleInGroup']
                }
            }
        }
    }
    #swagger.responses[201] = {
        description: '그룹 가입 성공',
        schema: {
            resultType: 'SUCCESS',
            error: null,
            success: {
                id: 5,
                groupId: 1,
                userId: 2,
                roleInGroup: 'child',
                isCreator: false
            }
        }
    }
    */
    try {
        console.log('그룹 가입 요청');

        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const userId = req.user.id; // 요청한 유저의 ID
        const { roleInGroup } = req.body;
        const groupId = parseInt(req.params.groupId);

        // 서비스 호출하여 그룹에 사용자 추가
        const newUserGroup = await joinGroup(userId, groupId, roleInGroup);

        res.status(201).json({
            resultType: 'SUCCESS',
            error: null,
            success: newUserGroup,
        });
    } catch (error) {
        console.error(error);
        next(error); // 에러 미들웨어로 전달
    }
};
