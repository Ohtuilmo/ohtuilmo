import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'


const url = `${BACKEND_API_BASE}/timelogs`


const getTimeLogs = async () => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in getTimeLogs', error.response.data.error)
    throw error
  }
}

const createTimeLog = async (timeEntry) => {
  try {
    const response = await axios.post(url, timeEntry, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in createTimeLog', error.response.data.error)
    throw error
  }
}

const deleteTimeLog = async (id) => {
  try {
    const response = await axios.delete(`${url}/${id}`, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in deleteTimeLog', error.response.data.error)
    throw error
  }
}

export default { getTimeLogs, createTimeLog, deleteTimeLog }
