import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

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
    }
    toast.info('Faça login para continuar', {
      description: 'Crie uma conta ou entre para realizar esta ação.',
    })
    navigate('/login')
  }
}
