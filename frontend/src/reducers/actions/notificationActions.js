export const clearNotifications = () => {
  return {
    type: 'CLEAR_NOTIFICATIONS'
  }
}

const setNotification = (message, type, duration) => ({
  type: 'SET_NOTIFICATION',
  payload: { message, type, duration }
})

export const setError = (message, duration = 3000) => {
  return setNotification(message, 'error', duration)
}

export const setSuccess = (message, duration = 3000) => {
  return setNotification(message, 'success', duration)
}

export const setInfo = (message, duration = 3000) => {
  return setNotification(message, 'info', duration)
}
