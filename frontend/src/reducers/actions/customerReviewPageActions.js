const initializeAnswerSheet = (answerSheet) => {
  return {
    type: 'CUSTOMER_REVIEW_INITIALIZE_ANSWER_SHEET',
    payload: answerSheet
  }
}

const updateAnswer = (answer, questionId) => {
  return {
    type: 'CUSTOMER_REVIEW_UPDATE_ANSWER',
    answer: answer,
    questionId: questionId
  }
}

const setLoading = (loading) => {
  return {
    type: 'CUSTOMER_REVIEW_LOADING',
    payload: loading
  }
}

const setReview = (review) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_REVIEW',
    payload: review
  }
}

const setQuestions = (questions) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_QUESTIONS',
    payload: questions
  }
}

const setGroupName = (group) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_GROUP_NAME',
    payload: group
  }
}

const setGroupId = (groupId) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_GROUP_ID',
    payload: groupId
  }
}

const setTopicId = (topicId) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_TOPIC_ID',
    payload: topicId
  }
}

const setConfiguration = (configurationId) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_CONFIGURATION',
    payload: configurationId
  }
}

const setNoGroup = (noGroupFound) => {
  return {
    type: 'CUSTOMER_REVIEW_SET_NOGROUP',
    payload: noGroupFound
  }
}

export default {
  updateAnswer,
  initializeAnswerSheet,
  setLoading,
  setReview,
  setQuestions,
  setGroupName,
  setGroupId,
  setTopicId,
  setConfiguration,
  setNoGroup
}
