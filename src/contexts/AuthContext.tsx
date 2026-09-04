/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { jwtDecode } from 'jwt-decode'
import { Usuario } from '../services/endpoints/auth'
import { setBearerToken, removeBearerToken } from '../services/endpoints/_axios'
import { parseApiError } from '../lib/errors'
import api from '../services/api'

type AuthData = {
  user: Usuario | null
  setUser: (user: Usuario | null) => void
  handleLogin: (email: string, password: string) => Promise<{ logged: boolean, isAdmin: boolean, naoAtivado?: boolean }>
  isLogged: boolean
  checkLogged: () => boolean
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

export const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkLogged = useCallback(() => {
    setLoading(true)
    const userFromLocalStorage = localStorage.getItem('user')
    const tokenExp = localStorage.getItem('tokenExp')

    if (userFromLocalStorage && tokenExp) {
      const isTokenValid = new Date() < new Date(+tokenExp * 1000)
      if (isTokenValid) {
        const parsedUser = JSON.parse(userFromLocalStorage)
        setUser(parsedUser)
        setIsLogged(true)
        setBearerToken(localStorage.getItem('token') || '')
        setIsAdmin(!!parsedUser.permissao.find((p: { descricao: string }) => p.descricao === 'ADMIN'));
        setLoading(false)
        return true
      }
    }

    setUser(null)
    setIsLogged(false)
    setLoading(false)
    return false
  }, [])

  useEffect(() => {
    checkLogged()
  }, [checkLogged])

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await api.auth.login({ email, senha: password })
      // Backend wraps response in ResponseHandler: { data: { usuario, token }, message, status }
      const raw = res as any
      const userRaw = raw.data?.data || raw.data
      if (userRaw && userRaw.token) {
        localStorage.setItem('token', userRaw.token)
        localStorage.setItem('user', JSON.stringify(userRaw.usuario))
        setUser(userRaw.usuario)
        setIsLogged(true)
        setBearerToken(userRaw.token)
        const decoded: { exp: number } = jwtDecode(userRaw.token)
        const exp = decoded.exp
        localStorage.setItem('tokenExp', exp.toString())
        const admin = !!userRaw.usuario.permissao.find((p: { descricao: string }) => p.descricao === 'ADMIN')
        setIsAdmin(admin)
        return { logged: true, isAdmin: admin }
      }
    } catch (err) {
      // Extrai mensagem específica do backend (e.g. "Usuário não foi ativado, verifique seu email").
      // Casos especiais com mensagem mais amigável; o resto vai pelo parser padrão.
      const apiMessage = parseApiError(err)
      const status = err instanceof AxiosError ? err.response?.status : undefined
      let naoAtivado = false

      if (apiMessage.toLowerCase().includes('não foi ativado')
        || apiMessage.toLowerCase().includes('nao foi ativado')) {
        naoAtivado = true
        toast.error('Necessário confirmar seu email', {
          description: 'Verifique sua caixa de correios ou spam para encontrar o link de confirmação.',
          duration: 8000,
        })
      } else if (status === 401 || apiMessage.toLowerCase().includes('senha incorret')
        || apiMessage.toLowerCase().includes('credenciais')) {
        toast.error('E-mail ou senha incorretos')
      } else {
        toast.error(apiMessage)
      }
      return { logged: false, isAdmin: false, naoAtivado }
    } finally {
      setLoading(false)
    }
    return { logged: false, isAdmin: false }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('tokenExp')
    setUser(null)
    setIsLogged(false)
    removeBearerToken()
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      handleLogin,
      isLogged,
      checkLogged,
      logout,
      loading,
      isAdmin,
    }),
    [user, isLogged, loading, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
