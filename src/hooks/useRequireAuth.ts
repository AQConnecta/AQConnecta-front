import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

/**
 * Retorna um "guard" para ações que exigem login. Se o usuário estiver logado,
 * executa a ação; caso contrário, guarda a rota atual e manda para o login.
 */
export function useRequireAuth() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return function guard(action: () => void) {
    if (user) {
      action()
      return
    }
    try {
      sessionStorage.setItem('postLoginRedirect', location.pathname + location.search)
    } catch {
      /* ignore */
    }
    toast.info('Faça login para continuar', {
      description: 'Crie uma conta ou entre para realizar esta ação.',
    })
    navigate('/login')
  }
}
