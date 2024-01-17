import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/customerReview`


const create = async (customerReview) => {
  const response = await axios.post(url, customerReview)

  return response.data
}

const getReviewQuestions = async (configurationId) => {
  const response = await axios.get(
    `${BACKEND_API_BASE}/configurations/${configurationId}/customerreviewquestions`
  )

  return response.data
}

const getDataForReview = async (secretId) => {
  const response = await axios.get(`${url}/${secretId}`)
  return response.data
}

const getCustomerReviewAnswers = async (configurationId) => {
  if (configurationId === 0) {
    const response = await axios.get(`${url}/all`, {
      headers: { Authorization: 'Bearer ' + getUserToken() }
    })
    return response.data
  } else {
    const response = await axios.get(
      `${url}/all/forConfiguration/${configurationId}`,
      {
        headers: { Authorization: 'Bearer ' + getUserToken() }
      }
    )
    return response.data
  }
}


export default {
  create,
  getReviewQuestions,
  getDataForReview,
  getCustomerReviewAnswers
}
