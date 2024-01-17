const initializeAnswerSheet = (answerSheet) => {
  return {
    type: 'INSTRUCTOR_INITIALIZE_ANSWER_SHEET',
    payload: answerSheet
  }
}

const updateAnswer = (answer, userId, questionId) => {
  return {
    type: 'INSTRUCTOR_UPDATE_ANSWER',
    answer: answer,
    user: userId,
    question: questionId
  }
}

const setGroups = (groups) => {
  return {
    type: 'SET_INSTRUCTOR_REVIEW_GROUPS',
    payload: groups
  }
}
const setSubmittedReview = (submittedReview) => {
  return {
    type: 'INSTRUCTOR_SET_SUBMITTED_REVIEW',
    payload: submittedReview
  }
}

const selectGroup = (groupId) => {
  return {
    type: 'INSTRUCTOR_SELECT_GROUP',
    payload: groupId
  }
}

export default {
  updateAnswer,
  initializeAnswerSheet,
  setSubmittedReview,
  selectGroup,
  setGroups
}
