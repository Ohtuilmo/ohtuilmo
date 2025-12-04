import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/login`

const login = async (credentials) => {
  if (!credentials) {
    // This needs to run before getting user from localStorage
    // because otherwise dev fake_shibbo would not update
    // role change
    if (import.meta.env.MODE === 'development') {
      const response = await axios.post(url, credentials)
      return response.data
    }

    const savedUser = localStorage.getItem("loggedInUser")
    if (savedUser) {
      return JSON.parse(savedUser)
    }

    throw new Error('Login attempt failed, no credentials given')
  }

  const response = await axios.post(url, credentials)
  return response.data
}

export default { login }
