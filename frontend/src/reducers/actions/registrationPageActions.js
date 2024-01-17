const updateTopics = (topics) => {
  return {
    type: 'UPDATE_REGISTRATION_TOPICS',
    payload: topics
  }
}

const updateEmail = (email) => {
  return {
    type: 'UPDATE_REGISTRATION_EMAIL',
    payload: email
  }
}

const updateQuestions = (questions) => {
  return {
    type: 'UPDATE_REGISTRATION_QUESTIONS',
    payload: questions
  }
}

const updateQuestionAnswer = (answer, questionIndex) => {
  return {
    type: 'UPDATE_REGISTRATION_QUESTION_ANSWER',
    index: questionIndex,
    answer: answer
  }
}

export default {
  updateTopics,
  updateEmail,
  updateQuestions,
  updateQuestionAnswer
}