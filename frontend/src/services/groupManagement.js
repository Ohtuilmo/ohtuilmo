import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken, getUser } from '../utils/functions'

const url = `${BACKEND_API_BASE}/groups`

const get = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

const create = async (newGroup) => {
  const response = await axios.post(url, newGroup, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

const put = async (updatedGroup) => {
  const response = await axios.put(`${url}/${updatedGroup.id}`, updatedGroup, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

const del = async (groupToDelete) => {
  const response = await axios.delete(`${url}/${groupToDelete.id}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

const getByStudent = async () => {
  const userStudentNumber = getUser().student_number

  const response = await axios.get(`${url}/bystudent/${userStudentNumber}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

const getByInstructor = async () => {
  const userStudentNumber = getUser().student_number

  const response = await axios.get(`${url}/byinstructor/${userStudentNumber}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  return response.data
}

export default { get, create, put, del, getByStudent, getByInstructor }
