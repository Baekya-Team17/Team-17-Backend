export const responseFromCreateGroup = (userGroup) => {
    return {
        userId: userGroup.userId,
        groupId: userGroup.groupId,
        roleInGroup: userGroup.roleInGroup,
        isCreator: userGroup.isCreator
    }
}