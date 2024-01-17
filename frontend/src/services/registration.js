import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/registrations`

const create = async ({ questions, preferred_topics }) => {
  const response = await axios.post(
    url,
    { questions, preferred_topics },
    { headers: { Authorization: 'Bearer ' + getUserToken() } }
  )
  return response.data.registration
}

const getOwn = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  /**
   * Backend returns 204 when there is no registration to current
   * iteration made by user fetching the registrationdetails
   */
  if (response.status === 204) {
    return null
  }
  return response.data.registrations
}

const current = async () => {
  const response = await axios.get(url + '/current', {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data.registrations
}

export default { create, getOwn, current }
