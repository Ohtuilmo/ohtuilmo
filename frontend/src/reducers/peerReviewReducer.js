const initialState = {
  answerSheet: [],
  isInitializing: true,
  peers: [],
  groupsLoading: true,
  submittedReviews: [],
  questions: '',
  configurationId: ''
}

const peerReviewReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INITIALIZE_ANSWER_SHEET':
    return {
      ...state,
      answerSheet: action.payload,
      isInitializing: false
    }
  case 'UPDATE_ANSWER':
    return {
      ...state,
      answerSheet: [
        ...state.answerSheet.slice(0, action.questionId),
        {
          ...state.answerSheet[action.questionId],
          answer: action.answer
        },
        ...state.answerSheet.slice(action.questionId + 1)
      ]
    }
  case 'CREATE_PEERS':
    return {
      ...state,
      peers: action.payload,
      groupsLoading: false
    }
  case 'SET_SUBMITTED_REVIEWS':
    return {
      ...state,
      submittedReviews: action.payload
    }
  case 'LOADING':
    return {
      ...state,
      isInitializing: action.payload
    }
  case 'SET_QUESTIONS':
    return {
      ...state,
      questions: action.payload
    }
  case 'SET_CONFIGURATION':
    return {
      ...state,
      configurationId: action.payload
    }
  default:
    return state
  }
}

export default peerReviewReducer
