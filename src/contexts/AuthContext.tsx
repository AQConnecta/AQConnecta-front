import React, { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { enqueueSnackbar } from 'notistack'
import { jwtDecode } from 'jwt-decode'
import { Usuario } from '../services/endpoints/auth'
import { setBearerToken } from '../services/endpoints/_axios'
import api from '../services/api'

type AuthData = {
  user: Usuario | null
  // eslint-disable-next-line no-unused-vars
  handleLogin: (email: string, password: string) => Promise<boolean>
  isLogged: boolean
  checkLogged: () => boolean
}

export const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLogged, setIsLogged] = useState(false)

  const checkLogged = useCallback(() => {
    const userFromLocalStorage = localStorage.getItem('user')
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage))
    }
    if (!user && new Date() > new Date(+localStorage.getItem('tokenExp') * 1000)) {
      setUser(null)
      setIsLogged(false)
      return false
    }
    setIsLogged(true)
    return true
  }, [user, setUser])

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await api.auth.login({ email, senha: password })
      const userRaw = res.data
      if (userRaw) {
        localStorage.setItem('token', userRaw.token)
        setUser(userRaw.usuario)
        setIsLogged(true)
        setBearerToken(userRaw.token)
        const decoded = jwtDecode(userRaw.token)
        const exp = decoded.exp
        localStorage.setItem('tokenExp', exp.toString())
        return true
      }
    } catch (err) {
      enqueueSnackbar('Usuário ou senha inválidos', { variant: 'error' })
      return false
    }
  }

  const value = useMemo(
    () => ({
      user,
      handleLogin,
      isLogged,
      checkLogged,
    }),
    [user, isLogged],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
