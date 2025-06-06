import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const urlTimelogs = `${BACKEND_API_BASE}/instructorTimelogs`

const getTimeLogs = async () => {
  try {
    const response = await axios.get(urlTimelogs, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in getTimeLogs', error.response.data.error)
    throw error
  }
}

const moveTimeLogToPreviousSprint = async (id) => {
  try {
    const response = await axios.patch(`${urlTimelogs}/${id}/moveToPrevious`, {}, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in moveTimeLogToPreviousSprint', error.response.data.error)
    throw error
  }
}

const moveTimeLogToNextSprint = async (id) => {
  try {
    const response = await axios.patch(`${urlTimelogs}/${id}/moveToNext`, {}, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in moveTimeLogToNextSprint', error.response.data.error)
    throw error
  }
}

export default { getTimeLogs, moveTimeLogToPreviousSprint, moveTimeLogToNextSprint }
