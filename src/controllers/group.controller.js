import { groupCreate } from "../services/group.service.js";
import { getUserGroups } from "../services/group.service.js";

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

        // if (!req.user || !req.user.id) {
        //     throw new Error("사용자 인증 정보가 누락되었습니다.");
        // }

        // const userId = req.user.id;

        const userId = 1;

        // 서비스 호출하여 그룹 데이터 가져오기
        const userGroups = await getUserGroups(userId);

        res.success(userGroups);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
