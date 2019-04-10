import axios from 'axios'
import { getUserToken } from '../utils/functions'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/instructorreview`

const create = async (instructorReview) => {
  console.log('createen päästiin')
  const response = await axios.post(url, instructorReview, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}
const get = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })
  return response.data
}

export default { get, create }
