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

export default { setCurrentConfiguration, setConfigurations, setAnswers }
