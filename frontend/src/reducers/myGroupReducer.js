const initialState = {
  myGroup: null
}

const myGroupReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'INITIALIZE_MYGROUP':
    return {
      ...state,
      myGroup: action.payload
    }
  case 'CLEAR_MYGROUP':
    return {
      ...state,
      myGroup: null
    }
  default:
    return state
  }
}
export default myGroupReducer
