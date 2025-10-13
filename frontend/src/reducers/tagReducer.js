const initialState = {
  availableTags: [],
  studentTags: {},
}

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AVAILABLE_TAGS':
      return { ...state, availableTags: action.payload }
    case 'SET_STUDENT_TAGS':
      return { ...state, studentTags: action.payload }
    case 'RESET_TAGS':
      return initialState
    default:
      return state
  }
}

export default tagsReducer