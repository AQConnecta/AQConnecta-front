import axios, {AxiosInstance} from 'axios'
import config from './config'

export const RequestHeaders = {
  'Content-Type': 'application/json'
}

const _axios: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 16000,
  headers: RequestHeaders,
})

export function setBearerToken(token: string) {
  _axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeBearerToken() {
  delete _axios.defaults.headers.common['Authorization']
}

_axios.interceptors.response.use(
  response => response,
  error => {
    console.log(error)
    if (error.response.status === 401) {
      removeBearerToken()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default _axios
