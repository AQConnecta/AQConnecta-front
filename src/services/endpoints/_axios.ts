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

export default _axios
