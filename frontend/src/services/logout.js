import axios from 'axios'
import { BACKEND_API_BASE } from '../utils/config'

const url = `${BACKEND_API_BASE}/logout`

const logout = async () => {
  const returnUrl = window.location.origin
  const { data } = await axios.post(url, { returnUrl: returnUrl })
  return data.logoutUrl
}

export default { logout }
