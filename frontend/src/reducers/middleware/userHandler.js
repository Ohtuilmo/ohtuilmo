const userHandler = () => (next) => (action) => {
  if (action.type === 'LOGIN_USER') {
    window.localStorage.setItem('loggedInUser', JSON.stringify(action.payload))
  }

  if (action.type === 'LOGOUT_USER') {
    window.localStorage.removeItem('loggedInUser')
  }

  return next(action)
}

export default userHandler
