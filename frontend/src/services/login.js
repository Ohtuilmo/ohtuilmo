import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/login`

const login = async (credentials) => {
  const response = await axios.post(url, credentials)
  return response.data
}

export default { login }
