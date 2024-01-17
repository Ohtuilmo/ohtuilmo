import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/tokenCheck`

const userCheck = async (token) => {
  const response = await axios.get(url + '/login', { headers: { 'Authorization': 'Bearer ' + token } })
  return response.data
}

export default { userCheck }
