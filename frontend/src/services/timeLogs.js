import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/timelogs`

const getTimeLogs = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  return response.data
}

const createTimeLog = async (timeEntry) => {
  const response = await axios.post(url, timeEntry, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  return response.data
}

const deleteTimeLog = async (id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  return response.data
}

export default { getTimeLogs, createTimeLog, deleteTimeLog }
