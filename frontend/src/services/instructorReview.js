import axios from 'axios'
import { getUserToken } from '../utils/functions'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/instructorreview`

const create = async (instructorReview) => {
  const response = await axios.post(url, instructorReview, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

const getAllAnsweredGroupId = async () => {
  const response = await axios.get(url + '/getAllAnsweredGroupId', {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })
  return response.data
}

const getAll = async () => {
  const response = await axios.get(url + '/', {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })
  return response.data
}

export default { create, getAllAnsweredGroupId, getAll }
