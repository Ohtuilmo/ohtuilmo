const initialState = {
  configurations: [],
  currentConfiguration: null,
  answers: null
}
const instructorPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_INSTRUCTORPAGE_CONFIGURATIONS':
    return {
      ...state,
      configurations: action.payload
    }
  case 'SET_INSTRUCTORPAGE_CURRENT_CONFIGURATION':
    return {
      ...state,
      currentConfiguration: action.payload
    }
  case 'SET_INSTRUCTORPAGE_CURRENT_ANSWERS':
    return {
      ...state,
      answers: action.payload
    }
  default:
    return state
  }
}

export default instructorPageReducer
