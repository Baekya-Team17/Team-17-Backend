import { groupCreate } from "../services/group.service.js";
import { getUserGroups } from "../services/group.service.js";
import { inviteUserToGroup } from "../services/group.service.js";

export const handleCreateGroup = async (req, res, next) => {
    /*
#swagger.summary = '사용자-그룹 관계 생성 API'
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

    if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 누락되었습니다.");
    }

    const userId = req.user.id // 수정 

    const roleInGroup = req.body.roleInGroup;

    const group = await groupCreate(userId, roleInGroup);

    res.success(group);
}

export const handleListGroups = async (req, res, next) => {
    /*
    #swagger.summary = '사용자 그룹 조회 API'
    #swagger.description = '사용자가 속한 그룹 리스트를 반환합니다.'
    #swagger.responses[200] = {
        description: '사용자 그룹 조회 성공',
        schema: {
            resultType: 'SUCCESS',
            error: null,
            success: [
                {
                    id: 1,
                    roleInGroup: 'parent',
                    isCreator: true,
                    group: {
                        id: 3,
                        createdAt: '2023-01-01T12:00:00Z',
                        updatedAt: '2023-01-02T12:00:00Z'
                    }
                }
            ]
        }
    }
    */

    try {
        console.log('사용자 그룹 조회 요청');

        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const userId = req.user.id;

        // 서비스 호출하여 그룹 데이터 가져오기
        const userGroups = await getUserGroups(userId);

        res.success(userGroups);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


export const handleInviteUserToGroup = async (req, res, next) => {
    /*
    #swagger.summary = '그룹에 사용자 초대 API'
    #swagger.description = '그룹 생성자가 그룹에 사용자를 초대합니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        inviteUserNickname: {
                            type: 'string',
                            description: '초대할 유저 닉네임임',
                            example: "userNickname"
                        },
                        roleInGroup: {
                            type: 'string',
                            enum: ['parent', 'child'],
                            description: '그룹 내 역할',
                            example: 'child'
                        }
                    },
                    required: ['groupId', 'inviteUserId', 'roleInGroup']
                }
            }
        }
    }
    #swagger.responses[201] = {
        description: '그룹에 사용자 초대 성공',
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
        console.log('그룹에 사용자 초대 요청');

        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const requestingUserId = req.user.id; // 요청한 유저 ID

        const { inviteUserNickname, roleInGroup } = req.body;

        console.log(typeof inviteUserNickname)

        const groupId = parseInt(req.params.groupId);

        // 서비스 호출하여 그룹에 사용자 추가
        const newUserGroup = await inviteUserToGroup(requestingUserId, groupId, inviteUserNickname, roleInGroup);

        res.status(201).success(newUserGroup);
    } catch (error) {
        console.error(error);
        next(error); // 에러 미들웨어로 전달
    }
};
