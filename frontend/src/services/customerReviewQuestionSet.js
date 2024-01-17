import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/customerReviewQuestions`

const create = async (reviewQuestionSet) => {
  const config = {
    headers: { Authorization: 'bearer ' + getUserToken() }
  }
  const response = await axios.post(url, reviewQuestionSet, config)
  return response.data.questionSet
}

const update = async (reviewQuestionsSet) => {
  const config = {
    headers: { Authorization: 'bearer ' + getUserToken() }
  }
  const response = await axios.put(
    url + '/' + reviewQuestionsSet.id,
    reviewQuestionsSet,
    config
  )
  return response.data.questionSet
}

const getAll = async () => {
  const config = {
    headers: { Authorization: 'bearer ' + getUserToken() }
  }
  const response = await axios.get(url, config)
  return response.data.questionSets
}

export default { create, update, getAll }
