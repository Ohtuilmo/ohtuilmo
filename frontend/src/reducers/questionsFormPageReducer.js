const initialState = {
  registration_question_sets: [],
  review_question_sets: [],
  selected_question_set: {
    id: '',
    name: '',
    questions: '',
    old_name: ''
  },
  mode: ''
}

const questionsFormPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_REGISTRATION_QUESTION_SETS':
    return {
      ...state,
      registration_question_sets: action.payload
    }
  case 'UPDATE_REVIEW_QUESTION_SETS':
    return {
      ...state,
      review_question_sets: action.payload
    }
  case 'UPDATE_SELECTED_QUESTION_SET':
    return {
      ...state,
      selected_question_set: action.payload
    }
  case 'UPDATE_SELECTED_QUESTION_SET_NAME':
    return {
      ...state,
      selected_question_set: {
        ...state.selected_question_set,
        name: action.payload
      }
    }
  case 'UPDATE_SELECTED_QUESTION_SET_QUESTIONS':
    return {
      ...state,
      selected_question_set: {
        ...state.selected_question_set,
        questions: action.payload
      }
    }
  case 'UPDATE_MODE':
    return {
      ...state,
      mode: action.payload
    }
  case 'CLEAR_SELECTED_QUESTION_SET':
    return {
      ...state,
      selected_question_set: {
        id: '',
        questions: '',
        name: '',
        old_name: ''
      }
    }
  default:
  }
  return state
}

export default questionsFormPageReducer