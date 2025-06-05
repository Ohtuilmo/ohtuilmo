const initialState = {
  content: {
    title: '',
    customerName: '',
    email: '',
    organisation: '',
    description: '',
    environment: '',
    specialRequests: '',
    additionalInfo: '',
    ipRights: '', // ensure ipRights is always present
    summerDates: {
      short: false,
      long: false
    }
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
  case 'UPDATE_ORGANISATION_TYPE':
    return {
      ...state,
      content: {
        ...state.content,
        organisation: action.payload
      }
    }
  case 'UPDATE_IP_RIGHTS':
    return {
      ...state,
      content: {
        ...state.content,
        ipRights: action.payload
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
  case 'UPDATE_DATES':
    return {
      ...state,
      content: {
        ...state.content,
        summerDates: action.payload
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
        additionalInfo: '',
        ipRights: '',
        organisation: '',
        summerDates: {
          short: false,
          long: false
        }
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
        additionalInfo: action.payload.additionalInfo,
        organisation: action.payload.organisation,
        summerDates: action.payload.summerDates,
        ipRights: action.payload.ipRights
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
