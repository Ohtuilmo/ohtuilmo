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

const moveTimeLog = async (direction, id) => {
  try {
    if (direction === 'previous') {
      const response = await axios.patch(`${urlTimelogs}/${id}/moveToPrevious`, {}, {
        headers: { Authorization: `Bearer ${getUserToken()}` }
      })
      return response.data
    } else if (direction === 'next') {
      const response = await axios.patch(`${urlTimelogs}/${id}/moveToNext`, {}, {
        headers: { Authorization: `Bearer ${getUserToken()}` }
      })
      return response.data
    } else {
      console.error('Invalid direction:', direction)
      throw new Error('Invalid direction')
    }
  } catch (error) {
    console.error('error in moveTimeLog', error.response.data.error)
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

export default { getTimeLogs, moveTimeLog, deleteTimeLog }
