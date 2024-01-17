import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/registrationQuestions`

const create = async (registrationQuestionSet) => {
  const config = {
    headers: { 'Authorization': 'bearer ' + getUserToken() }
  }
  const response = await axios.post(url, registrationQuestionSet, config)
  return response.data.questionSet
}

const update = async (registrationQuestionsSet) => {
  const config = {
    headers: { 'Authorization': 'bearer ' + getUserToken() }
  }
  const response = await axios.put(url + '/' + registrationQuestionsSet.id, registrationQuestionsSet, config)
  return response.data.questionSet
}

const getAll = async () => {
  const config = {
    headers: { 'Authorization': 'bearer ' + getUserToken() }
  }
  const response = await axios.get(url, config)
  return response.data.questionSets
}

export default { create, update, getAll }