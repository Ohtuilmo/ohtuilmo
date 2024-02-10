import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'


const url = `${BACKEND_API_BASE}/timelogging`


const getTimeEntries = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${getUserToken()}` }
  })
  return response.data
}


const createTimeEntry = async (timeEntry) => {
  console.log('timeEntry:', timeEntry)
  const response = await axios.post(url, timeEntry, {
    headers: { Authorization: `Bearer ${getUserToken()}` }
  })
  console.log('response:', response.data)
  return response.data
}

const deleteTimeEntry = async (id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { Authorization: `Bearer ${getUserToken()}` }
  })
  return response.data
}

export default { getTimeEntries, createTimeEntry, deleteTimeEntry }