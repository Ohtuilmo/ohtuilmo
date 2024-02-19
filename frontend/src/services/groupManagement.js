import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken, getUser } from '../utils/functions'

const url = `${BACKEND_API_BASE}/groups`

const get = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: 'Bearer ' + getUserToken() },
  })

  return response.data
}

const create = async (newGroup) => {
  const response = await axios.post(url, newGroup, {
    headers: { Authorization: 'Bearer ' + getUserToken() },
  })

  return response.data
}

const put = async (updatedGroup) => {
  const response = await axios.put(`${url}/${updatedGroup.id}`, updatedGroup, {
    headers: { Authorization: 'Bearer ' + getUserToken() },
  })

  return response.data
}

const del = async (groupToDelete) => {
  const response = await axios.delete(`${url}/${groupToDelete.id}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() },
  })

  return response.data
}

const getByStudent = async (studentNumber = null) => {
  let studentNumberToUse

  if (studentNumber) {
    studentNumberToUse = studentNumber
  } else {
    const user = getUser()
    studentNumberToUse = user ? user.student_number : undefined
  }

  const response = await axios.get(`${url}/bystudent/${studentNumberToUse}`, {
    headers: { Authorization: 'Bearer ' + getUserToken() },
  })

  return response.data
}

const getByInstructor = async (studentNumber = null) => {
  let studentNumberToUse

  if (studentNumber) {
    studentNumberToUse = studentNumber
  } else {
    const user = getUser()
    studentNumberToUse = user ? user.student_number : undefined
  }

  const response = await axios.get(
    `${url}/byinstructor/${studentNumberToUse}`,
    {
      headers: { Authorization: 'Bearer ' + getUserToken() },
    }
  )

  return response.data
}

export default { get, create, put, del, getByStudent, getByInstructor }
