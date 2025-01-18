import { groupCreate } from "../services/group.service.js";

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

    // 그룹 생성 및 유저그룹에 데이터 추가 , 역할 추가 
    // if (!req.user || !req.user.id) {
    //     throw new Error("사용자 인증 정보가 누락되었습니다.");
    // }

    // const userId = req.user.id // 수정 

    const userId = 1;

    const roleInGroup = req.body.roleInGroup;

    const group = await groupCreate(userId, roleInGroup);

    res.success(group);
}