const updateRegistrationQuestionSets = (registration_question_sets) => {
  return {
    type: 'UPDATE_REGISTRATION_QUESTION_SETS',
    payload: registration_question_sets
  }
}

const updateReviewQuestionSets = (review_question_sets) => {
  return {
    type: 'UPDATE_REVIEW_QUESTION_SETS',
    payload: review_question_sets
  }
}

const updateSelectedQuestionSet = (selected_question_set) => {
  return {
    type: 'UPDATE_SELECTED_QUESTION_SET',
    payload: selected_question_set
  }
}

const updateSelectedQuestionSetName = (selected_question_set_name) => {
  return {
    type: 'UPDATE_SELECTED_QUESTION_SET_NAME',
    payload: selected_question_set_name
  }
}

const updateSelectedQuestionSetQuestions = (selected_question_set_questions) => {
  return {
    type: 'UPDATE_SELECTED_QUESTION_SET_QUESTIONS',
    payload: selected_question_set_questions
  }
}

const updateMode = (mode) => {
  return {
    type: 'UPDATE_MODE',
    payload: mode
  }
}

const clearSelectedQuestionSet = () => {
  return {
    type: 'CLEAR_SELECTED_QUESTION_SET'
  }
}

export default {
  updateRegistrationQuestionSets,
  updateReviewQuestionSets,
  updateSelectedQuestionSet,
  updateSelectedQuestionSetName,
  updateSelectedQuestionSetQuestions,
  updateMode,
  clearSelectedQuestionSet
}