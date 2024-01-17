const initialState = {
  content: {
    title: '',
    customerName: '',
    email: '',
    description: '',
    environment: '',
    specialRequests: '',
    additionalInfo: ''
  },
  showInfo: true,
  preview: false,
  isSaved: false,
  secretId: ''
}

const topicFormReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_TITLE':
    return {
      ...state,
      content: {
        ...state.content,
        title: action.payload
      }
    }
  case 'UPDATE_CUSTOMER_NAME':
    return {
      ...state,
      content: {
        ...state.content,
        customerName: action.payload
      }
    }
  case 'UPDATE_EMAIL':
    return {
      ...state,
      content: {
        ...state.content,
        email: action.payload
      }
    }
  case 'UPDATE_DESCRIPTION':
    return {
      ...state,
      content: {
        ...state.content,
        description: action.payload
      }
    }
  case 'UPDATE_ENVIRONMENT':
    return {
      ...state,
      content: {
        ...state.content,
        environment: action.payload
      }
    }
  case 'UPDATE_SPECIAL_REQUESTS':
    return {
      ...state,
      content: {
        ...state.content,
        specialRequests: action.payload
      }
    }
  case 'UPDATE_ADDITIONAL_INFO':
    return {
      ...state,
      content: {
        ...state.content,
        additionalInfo: action.payload
      }
    }
  case 'CLEAR_FORM':
    return {
      ...state,
      content: {
        title: '',
        customerName: '',
        email: '',
        description: '',
        environment: '',
        specialRequests: '',
        additionalInfo: ''
      }
    }
  case 'SET_CURRENT_TOPIC':
    return {
      ...state,
      content: {
        title: action.payload.title,
        customerName: action.payload.customerName,
        email: action.payload.email,
        description: action.payload.description,
        environment: action.payload.environment,
        specialRequests: action.payload.specialRequests,
        additionalInfo: action.payload.additionalInfo
      }
    }
  case 'UPDATE_PREVIEW':
    return {
      ...state,
      preview: action.payload
    }
  case 'SET_SAVED':
    return {
      ...state,
      isSaved: action.payload
    }
  case 'UPDATE_SECRETID':
    return {
      ...state,
      secretId: action.payload
    }
  case 'UPDATE_SHOWINFO':
    return {
      ...state,
      showInfo: action.payload
    }
  default:
  }
  return state
}

export default topicFormReducer
