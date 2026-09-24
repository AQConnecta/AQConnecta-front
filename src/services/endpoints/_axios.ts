import axios, { AxiosInstance, AxiosResponse as _AxiosResponse } from 'axios'
import config from './config'

export const RequestHeaders = {
  'Content-Type': 'application/json',
}

const _axios: AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 15000,
  headers: RequestHeaders,
})

export function setBearerToken(token: string) {
  _axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export function removeBearerToken() {
  delete _axios.defaults.headers.common['Authorization']
}

_axios.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem('token')
    if (token) {
      cfg.headers['Authorization'] = `Bearer ${token}`
    }
    return cfg
  },
  (error) => Promise.reject(error),
)

_axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token')
      const currentPath = window.location.pathname
      // Só redireciona quando a sessão expirou (havia token). Visitante anônimo
      // navegando em páginas públicas não deve ser jogado para o /login.
      if (hadToken && !['/login', '/register', '/forgot-password'].includes(currentPath)) {
        removeBearerToken()
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('tokenExp')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export type AxiosResponse<T> = Partial<Omit<_AxiosResponse, 'data'>> & {
  data: { data: T }
}

export default _axios
