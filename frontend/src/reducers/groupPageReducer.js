const initialState = {
  groupName: '',
  students: '',
  groupTopicID: '',
  groupInstructor: null, // autosuggested user
  groupConfigurationID: '',
  groups: [],
  users: []
}

const groupPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_CREATE_GROUP_FORM_NAME':
    return {
      ...state,
      groupName: action.payload
    }
  case 'UPDATE_STUDENTS_FORM':
    return {
      ...state,
      students: action.payload
    }
  case 'UPDATE_TOPIC_ID':
    return {
      ...state,
      groupTopicID: action.payload
    }
  case 'UPDATE_INSTRUCTOR':
    return {
      ...state,
      groupInstructor: action.payload
    }
  case 'UPDATE_GROUP_CONFIGURATION_ID':
    return {
      ...state,
      groupConfigurationID: action.payload
    }
  case 'CREATE_GROUP_SUCCSESS':
    return {
      ...state,
      groupName: '',
      students: '',
      groupTopicID: '',
      groupInstructorID: '',
      groups: [...state.groups, action.payload]
    }
  case 'SET_GROUPS':
    return {
      ...state,
      groups: action.payload
    }
  case 'DELETE_FROM_GROUP':
    return {
      ...state,
      groups: state.groups.map((group) =>
        group.id === action.payload.id ? action.payload : group
      )
    }
  case 'UPDATE_EXISTING_GROUP':
    return {
      ...state,
      groups: state.groups.map((group) =>
        group.id === action.payload.id ? action.payload : group
      )
    }
  case 'DELETE_GROUP':
    return {
      ...state,
      groups: state.groups.filter((group) => group.id !== action.payload)
    }
  case 'SET_USERS':
    return {
      ...state,
      users: action.payload
    }
  default:
    return state
  }
}

export default groupPageReducer
