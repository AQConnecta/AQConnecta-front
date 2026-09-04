import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import FormField from '../../components/FormField'
import { resetPasswordSchema, ResetPasswordFormData } from '../../lib/validation'
import { handleApiError } from '../../lib/errors'
import api from '../../services/api'

function RedefinirSenha() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { senha: '', confirmarSenha: '' },
  })

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) return
    setIsSubmitting(true)
    try {
      await api.auth.resetPassword(token, data.senha)
      setSuccess(true)
    } catch (err) {
      handleApiError(err, 'Não foi possível redefinir a senha. O link pode ter expirado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-[420px] shadow-lg border-border/50 animate-scaleIn">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold">Link inválido</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Este link de redefinição de senha é inválido ou está incompleto. Solicite um novo.
            </p>
            <Button variant="outline" onClick={() => navigate('/forgot-password')} className="mt-2">
              Solicitar novo link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-[420px] shadow-lg border-border/50 animate-scaleIn">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Senha redefinida!</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Sua senha foi alterada com sucesso. Agora você já pode entrar com a nova senha.
            </p>
            <Button onClick={() => navigate('/login')} className="mt-2">
              Ir para o login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-[420px] animate-scaleIn">
        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Redefinir senha</CardTitle>
            <CardDescription className="px-4">Escolha uma nova senha para sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="relative">
                <FormField
                  label="Nova senha"
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite a nova senha"
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

              <div className="relative">
                <FormField
                  label="Confirmar nova senha"
                  id="confirmarSenha"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  error={errors.confirmarSenha?.message}
                  {...register('confirmarSenha')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Redefinir senha'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="w-full text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RedefinirSenha
