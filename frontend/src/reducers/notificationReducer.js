const initialState = {
  type: '',
  message: '',
  duration: 3000,
  open: false
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION': {
    const { type, message, duration } = action.payload
    return {
      ...state,
      open: true,
      type,
      message,
      duration
    }
  }
  case 'CLEAR_NOTIFICATIONS':
    return {
      // preserve other state so material-ui can transition out the
      // snackbar with the old text still on it
      ...state,
      open: false
    }
  default:
    return state
  }
}

export default notificationReducer
