
const initialState = {
  currentSprintNumber: undefined,
  selectedSprintNumber: undefined,
  groupSprintSummary: []
}

const timeLogsReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_CURRENT_SPRINT_NUMBER':
    return {
      ...state,
      currentSprintNumber: action.payload
    }
  case 'SET_SELECTED_SPRINT_NUMBER':
    return {
      ...state,
      selectedSprintNumber: action.payload
    }
  case 'SET_GROUP_SPRINT_SUMMARY':
    return {
      ...state,
      groupSprintSummary: action.payload
    }
  case 'RESET_GROUP_SPRINT_SUMMARY':
    return {
      ...state,
      groupSprintSummary: []
    }
  default:
    return state
  }
}

export default timeLogsReducer
