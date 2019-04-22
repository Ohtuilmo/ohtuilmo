import userService from '../../services/user'

export const loginUser = (user) => {
  return async (dispatch) => {
    try {
      const { isInstructor } = await userService.checkInstructor(user.token)
      user.user.instructor = isInstructor

      dispatch({ type: 'LOGIN_USER', payload: user })
    } catch (error) {
      console.log('ERROR', error)
    }
  }
}

export const logoutUser = () => {
  return {
    type: 'LOGOUT_USER'
  }
}

export const checkToken = (user) => {
  return async (dispatch) => {
    try {
      const { isInstructor } = await userService.checkInstructor(user.token) // This also checks validity of the token
      if (user.user.instructor !== isInstructor) {
        // Only update localStorage if there are changes in the token
        user.user.instructor = isInstructor
        dispatch({ type: 'LOGIN_USER', payload: user })
      }
    } catch (error) {
      if (error.response.status === 401) {
        // token malformed
        console.log('error logging in with token:', error)
        dispatch({ type: 'LOGOUT_USER' })
      } else {
        console.log('error:', error.response)
      }
    }
  }
}
