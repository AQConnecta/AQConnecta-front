import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { LogIn, Loader2, Eye, EyeOff, Mail } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import FormField from '../../components/FormField'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { loginSchema, LoginFormData } from '../../lib/validation'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [naoAtivadoEmail, setNaoAtivadoEmail] = useState<string | null>(null)
  const [reenviando, setReenviando] = useState(false)
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  })

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true)
    try {
      const { logged, naoAtivado } = await handleLogin(data.email, data.senha)
      if (logged) {
        const redirect = sessionStorage.getItem('postLoginRedirect')
        sessionStorage.removeItem('postLoginRedirect')
        navigate(redirect && !redirect.startsWith('/login') ? redirect : '/home')
        return
      }
      setNaoAtivadoEmail(naoAtivado ? data.email : null)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReenviar() {
    if (!naoAtivadoEmail) return
    setReenviando(true)
    try {
      await api.auth.resendConfirmation({ email: naoAtivadoEmail })
      toast.success('E-mail de confirmação reenviado', {
        description: 'Verifique sua caixa de entrada e a pasta de spam.',
      })
    } catch {
      toast.error('Não foi possível reenviar o e-mail. Tente novamente.')
    } finally {
      setReenviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-[420px] animate-scaleIn">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary tracking-tight">AQConnecta</h1>
          <p className="text-sm text-muted-foreground mt-1">Sua plataforma de conexão profissional</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                label="E-mail"
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="space-y-1.5">
                <div className="relative">
                  <FormField
                    label="Senha"
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    error={errors.senha?.message}
                    {...register('senha')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </span>
                ) : 'Entrar'}
              </Button>

              {naoAtivadoEmail && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                  <p className="font-medium text-amber-800">Confirme seu e-mail para entrar</p>
                  <p className="mt-0.5 text-amber-700">
                    Sua conta ainda não foi ativada. Não recebeu o e-mail de confirmação?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    disabled={reenviando}
                    onClick={handleReenviar}
                  >
                    {reenviando ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Reenviando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Reenviar e-mail de confirmação
                      </span>
                    )}
                  </Button>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                Não tem conta?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-semibold"
                >
                  Registre-se
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
