import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'


const urlTimelogs = `${BACKEND_API_BASE}/timelogs`
const urlGroupSprintSummary = `${BACKEND_API_BASE}/groupSprintSummary`

const getGroupSprintSummary = async (id) => {
  try {
    const response = await axios.get(`${urlGroupSprintSummary}/${id}`, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in getGroupSprintSummary', error.response.data.error)
    throw error
  }
}

const getTimeLogs = async () => {
  try {
    const response = await axios.get(urlTimelogs, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

const createTimeLog = async (timeEntry) => {
  try {
    const response = await axios.post(urlTimelogs, timeEntry, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

const deleteTimeLog = async (id) => {
  try {
    const response = await axios.delete(`${urlTimelogs}/${id}`, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in deleteTimeLog', error.response.data.error)
    throw error
  }
}

export default { getGroupSprintSummary, getTimeLogs, createTimeLog, deleteTimeLog }
