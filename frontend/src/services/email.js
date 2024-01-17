import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/email`

const getAuthHeaders = () => ({
  Authorization: 'Bearer ' + getUserToken()
})

const sendCustomerEmail = async ({ messageType, messageLanguage, topicId }) => {
  const response = await axios.post(
    url + '/send',
    {
      messageType,
      messageLanguage,
      topicId
    },
    {
      headers: getAuthHeaders()
    }
  )
  return response.data
}

const previewCustomerEmail = async ({
  messageType,
  messageLanguage,
  topicId
}) => {
  const res = await axios.post(
    `${url}/preview`,
    {
      messageType,
      messageLanguage,
      topicId
    },
    {
      headers: getAuthHeaders()
    }
  )

  return res.data
}

const getTemplates = async () => {
  const res = await axios.get(`${url}/templates`, {
    headers: getAuthHeaders()
  })
  return res.data
}

const updateTemplates = async (templates) => {
  const res = await axios.post(`${url}/templates`, templates, {
    headers: getAuthHeaders()
  })
  return res.data
}

export default {
  sendCustomerEmail,
  previewCustomerEmail,
  getTemplates,
  updateTemplates
}
