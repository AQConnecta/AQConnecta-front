import axios, {AxiosInstance} from 'axios'
import config from './config'

export const RequestHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Access-Control-Expose-Headers': 'Access-Control-',
  'Access-Control-Allow-Headers': 'Access-Control-, Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  'Access-Control-Allow-Origin': '*',
  Allow: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
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
