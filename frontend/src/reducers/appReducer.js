const initialState = {
  isLoading: false
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'UPDATE_IS_LOADING':
    return {
      ...state,
      isLoading: action.payload
    }
  default:
  }
  return state
}

export default appReducer