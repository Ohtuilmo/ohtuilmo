import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/sprints`

const getSprints = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  return response.data
}

const createSprint = async (sprintData) => {
  const response = await axios.post(url, sprintData, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  return response.data
}

const deleteSprint = async (id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  })
  return response.data
}

export default { getSprints, createSprint, deleteSprint }
