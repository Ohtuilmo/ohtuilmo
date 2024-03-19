import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'


const url = `${BACKEND_API_BASE}/tags`


const getTags = async () => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

const createTag = async (tag) => {
  try {
    const response = await axios.post(url, tag, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

const deleteTag = async (id) => {
  try {
    const response = await axios.delete(`${url}/${id}`, {
      headers: { Authorization: `Bearer ${getUserToken()}` }
    })
    return response.data
  } catch (error) {
    console.error('error in deleteTimeLog', error.response.data.error)
    throw error
  }
}

export default { getTags, createTag, deleteTag }
