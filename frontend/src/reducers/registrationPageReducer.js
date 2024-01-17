const initialState = {
  topics: [],
  questions: [],
  email: ''
}

const registrationPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_REGISTRATION_TOPICS':
    return {
      ...state,
      topics: action.payload
    }
  case 'UPDATE_REGISTRATION_EMAIL':
    return {
      ...state,
      email: action.payload
    }
  case 'UPDATE_REGISTRATION_QUESTIONS':
    return {
      ...state,
      questions: action.payload
    }
  case 'UPDATE_REGISTRATION_QUESTION_ANSWER':
    return {
      ...state,
      questions: state.questions.map(
        (question, i) => i === action.index ? { ...question, answer: action.answer } : question
      )
    }
  default:
  }
  return state
}

export default registrationPageReducer