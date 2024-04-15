const setConfigurations = (configurations) => {
  return {
    type: 'SET_INSTRUCTORPAGE_CONFIGURATIONS',
    payload: configurations
  }
}

const setCurrentConfiguration = (configurationNumber) => {
  return {
    type: 'SET_INSTRUCTORPAGE_CURRENT_CONFIGURATION',
    payload: configurationNumber
  }
}

const setAnswers = (answers) => {
  return {
    type: 'SET_INSTRUCTORPAGE_CURRENT_ANSWERS',
    payload: answers
  }
}

const setGroups = (groups) => {
  return {
    type: 'SET_INSTRUCTORPAGE_GROUPS',
    payload: groups
  }
}

const setCurrentGroupID = (groupId) => {
  return {
    type: 'SET_INSTRUCTORPAGE_CURRENT_GROUP_ID',
    payload: groupId
  }
}

export default { setCurrentConfiguration, setConfigurations, setAnswers, setCurrentGroupID, setGroups }
