const updateCreateGroupFormName = (groupName) => ({
  type: 'UPDATE_CREATE_GROUP_FORM_NAME',
  payload: groupName
})

const updateStudentsForm = (students) => ({
  type: 'UPDATE_STUDENTS_FORM',
  payload: students
})

const updateGroupTopicID = (topicID) => ({
  type: 'UPDATE_TOPIC_ID',
  payload: topicID
})

const updateGroupInstructor = (groupInstructor) => ({
  type: 'UPDATE_INSTRUCTOR',
  payload: groupInstructor
})

const updateGroupConfigurationID = (groupConfigurationID) => ({
  type: 'UPDATE_GROUP_CONFIGURATION_ID',
  payload: groupConfigurationID
})

const createGroupSuccsess = (newGroup) => ({
  type: 'CREATE_GROUP_SUCCSESS',
  payload: newGroup
})

const setGroups = (groups) => ({
  type: 'SET_GROUPS',
  payload: groups
})

const deleteFromGroup = (group) => ({
  type: 'DELETE_FROM_GROUP',
  payload: group
})

const updateExistingGroup = (group) => ({
  type: 'UPDATE_EXISTING_GROUP',
  payload: group
})

const deleteGroup = (groupId) => ({
  type: 'DELETE_GROUP',
  payload: groupId
})

const setUsers = (users) => ({
  type: 'SET_USERS',
  payload: users
})

export default {
  updateCreateGroupFormName,
  updateStudentsForm,
  updateGroupTopicID,
  updateGroupInstructor,
  updateGroupConfigurationID,
  createGroupSuccsess,
  setGroups,
  deleteFromGroup,
  updateExistingGroup,
  deleteGroup,
  setUsers
}
