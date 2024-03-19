import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'


const url = `${BACKEND_API_BASE}/tags`


const getTags = async () => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${getUserToken()}` }
  })
  return response.data
}

const createTag = async (tag) => {
  const response = await axios.post(url, tag, {
    headers: { Authorization: `Bearer ${getUserToken()}` }
  })
  return response.data

}

const deleteTag = async (id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { Authorization: `Bearer ${getUserToken()}` }
  })
  return response.data
}

export default { getTags, createTag, deleteTag }
