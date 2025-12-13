import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/role`

export const updateRole = async (role) => {
  const response = await axios.post(url, { role })
  return response.data?.role
}
