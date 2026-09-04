import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import FormField from '../../components/FormField'
import { registerSchema, RegisterFormData } from '../../lib/validation'
import { handleApiError, handleApiSuccess } from '../../lib/errors'
import api from '../../services/api'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: '', email: '', senha: '', confirmarSenha: '' },
  })

  async function onSubmit(data: RegisterFormData) {
    setIsSubmitting(true)
    try {
      await api.auth.register({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      })
      handleApiSuccess('Conta criada com sucesso! Verifique seu e-mail para ativar.')
      navigate('/login')
    } catch (err) {
      handleApiError(err)
    } finally {
      setIsSubmitting(false)
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
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Preencha os dados para se cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                label="Nome completo"
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                autoComplete="name"
                error={errors.nome?.message}
                {...register('nome')}
              />

              <FormField
                label="E-mail"
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <FormField
                  label="Senha"
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
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

              <FormField
                label="Confirmar senha"
                id="confirmarSenha"
                type="password"
                placeholder="Repita a senha"
                autoComplete="new-password"
                error={errors.confirmarSenha?.message}
                {...register('confirmarSenha')}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando conta...
                  </span>
                ) : 'Criar conta'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Já tem conta?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register
