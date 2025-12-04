import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/login`

const login = async (credentials) => {
  if (!credentials) {
    // local dev uses backend fake_shibbo => 200 /api/login
    // staging and production use shibbo => 401 /api/login
    if (import.meta.env.MODE === "development") {
      const response = await axios.post(url, credentials)
      return response.data
    }
    throw new Error("Login attempt failed, no credentials given")
  }

  const response = await axios.post(url, credentials)
  return response.data
}

export default { login }
