const initialState = {
  topic: '',
  isEditable: false,
  isOnEditMode: false
}

const viewTopicPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_TOPIC':
    return {
      ...state,
      topic: action.payload
    }
  case 'SET_TOPIC_CONTENT':
    return {
      ...state,
      topic: {
        content: action.payload
      }
    }
  case 'SET_EDITABLE':
    return {
      ...state,
      isEditable: action.payload
    }
  case 'SET_EDITMODE':
    return {
      ...state,
      isOnEditMode: action.payload
    }
  default:
  }
  return state
}

export default viewTopicPageReducer
