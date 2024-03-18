const initialState = {
  users: [],
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_USERS':
    return {
      ...state,
      users: action.payload,
    }
  case 'RESET_USERS':
    return initialState
  case 'SET_TEST_USERS':
    return {
      ...state,
      users: action.payload,
    }
  default:
    return state
  }
}

export default userReducer
