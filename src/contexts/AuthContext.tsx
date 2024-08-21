/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { enqueueSnackbar } from 'notistack'
import { jwtDecode } from 'jwt-decode'
import { Usuario } from '../services/endpoints/auth'
import { setBearerToken, removeBearerToken } from '../services/endpoints/_axios'
import api from '../services/api'

type AuthData = {
  user: Usuario | null
  setUser: (user: Usuario | null) => void
  handleLogin: (email: string, password: string) => Promise<boolean>
  isLogged: boolean
  checkLogged: () => boolean
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
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
      const userRaw = res.data
      if (userRaw) {
        localStorage.setItem('token', userRaw.token)
        localStorage.setItem('user', JSON.stringify(userRaw.usuario))
        setUser(userRaw.usuario)
        setIsLogged(true)
        setBearerToken(userRaw.token)
        const decoded: any = jwtDecode(userRaw.token)
        const exp = decoded.exp
        localStorage.setItem('tokenExp', exp.toString())
        return true
      }
    } catch (err) {
      enqueueSnackbar('Usuário ou senha inválidos', { variant: 'error' })
      return false
    } finally {
      setLoading(false)
    }
    return false
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
    }),
    [user, isLogged, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
