import axios, {AxiosInstance, AxiosResponse as _AxiosResponse} from 'axios'
import config from './config'

export const RequestHeaders = {
  'Content-Type': 'application/json'
}

const _axios: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: import.meta.env.VITE_TIMEOUT,
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

_axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export type AxiosResponse<T> = Partial<Omit<_AxiosResponse, 'data'>> & {
  data: {data: T }
}

export default _axios
