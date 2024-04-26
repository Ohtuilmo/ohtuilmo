import store from '../reducers/store'

export const getUserToken = () => {
  const state = store.getState()
  if (state && state.login && state.login.user) return state.login.user.token
  return undefined
}

export const getUser = () => {
  const { login } = store.getState()

  if (login && login.user && login.user.user) return login.user.user
  return undefined
}

/**
 * Format datetime
 * eg. from 2019-02-07T10:57:19.122Z to 7.2.2019 12.57
 */
export const formatDate = (date) => {
  const parsedDate = new Date(date).toLocaleString('fi-FI')
  return parsedDate.slice(0, parsedDate.lastIndexOf('.')).replace('klo', '')
}

export const minutesToFormattedHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0')
  const minutes = (totalMinutes % 60).toString().padStart(2, '0')
  return { hours, minutes }
}

export const hoursAndMinutesToMinutes = ({ hours, minutes }) => {
  return hours * 60 + minutes
}

export const minutesAndHoursFromString = (string) => {
  const parts = string.split(':')
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  return { hours, minutes }
}

export const addWeeksToDate = (date, weeks) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + weeks * 7)
  return newDate
}

export const addDaysToDate = (date, days) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export const extractCallingName = (firstNames) => {
  if (firstNames.includes('*')) {
    return firstNames.split('*')[1].split(' ')[0]
  }
  return firstNames.split(' ')[0]
}
