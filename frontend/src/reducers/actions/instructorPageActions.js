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

const setCurrentGroup = (groupName) => {
  return {
    type: 'SET_INSTRUCTORPAGE_CURRENT_GROUP',
    payload: groupName
  }
}

export default { setCurrentConfiguration, setConfigurations, setAnswers, setCurrentGroup, setGroups }
