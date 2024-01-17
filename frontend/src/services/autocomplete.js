import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'
import { getUserToken } from '../utils/functions'

const url = `${BACKEND_API_BASE}/autocomplete`

/**
 * @returns {AutocompleteResult[]}
 * @typedef {{ student_number: string, first_names: string, last_name: string }} AutocompleteResult
 */
const findUsersByPartialName = async (partialName) => {
  // returns 400 if less than 3 characters passed!
  const response = await axios.get(`${url}/users`, {
    params: {
      name: partialName
    },
    headers: { Authorization: 'Bearer ' + getUserToken() }
  })

  // [ { student_number, first_names, last_name } ]
  return response.data
}

export default { findUsersByPartialName }
