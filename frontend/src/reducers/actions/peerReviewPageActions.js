const initializeAnswerSheet = (answerSheet) => {
  return {
    type: 'INITIALIZE_ANSWER_SHEET',
    payload: answerSheet
  }
}

const updateAnswer = (answer, questionId) => {
  return {
    type: 'UPDATE_ANSWER',
    answer: answer,
    questionId: questionId
  }
}
const createPeers = (peers) => {
  return {
    type: 'CREATE_PEERS',
    payload: peers
  }
}
const setSubmittedReviews = (submittedReviews) => {
  return {
    type: 'SET_SUBMITTED_REVIEWS',
    payload: submittedReviews
  }
}
const setLoading = (loading) => {
  return {
    type: 'LOADING',
    payload: loading
  }
}

const setQuestions = (questions) => {
  return {
    type: 'SET_QUESTIONS',
    payload: questions
  }
}

const setConfiguration = (configurationId) => {
  return {
    type: 'SET_CONFIGURATION',
    payload: configurationId
  }
}

export default {
  updateAnswer,
  initializeAnswerSheet,
  createPeers,
  setSubmittedReviews,
  setLoading,
  setQuestions,
  setConfiguration
}
