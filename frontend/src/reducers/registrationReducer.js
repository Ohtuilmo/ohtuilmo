const registrationReducer = (state = [], action) => {
  switch (action.type) {
  case 'SET_REGISTRATIONS':
    return action.payload
  case 'CLEAR_REGISTRATIONS':
    return null
  default:
    return state
  }
}

export default registrationReducer
