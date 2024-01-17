import store from '../reducers/store'

export const getUserToken = () => {
  const { user } = store.getState()
  return user.token
}

export const getUser = () => {
  const { user } = store.getState()
  return user.user
}

/**
 * Format datetime
 * eg. from 2019-02-07T10:57:19.122Z to 7.2.2019 12.57
 */
export const formatDate = (date) => {
  const parsedDate = new Date(date).toLocaleString('fi-FI')
  return parsedDate.slice(0, parsedDate.lastIndexOf('.')).replace('klo', '')
}
