const initialState = {
  configurations: [],
  currentConfiguration: null,
  answers: null,
  groups: [],
  currentGroup: null
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
  case 'SET_INSTRUCTORPAGE_GROUPS':
    return {
      ...state,
      groups: action.payload
    }
  case 'SET_INSTRUCTORPAGE_CURRENT_GROUP':
    return {
      ...state,
      currentGroup: action.payload
    }
  default:
    return state
  }
}

export default instructorPageReducer
