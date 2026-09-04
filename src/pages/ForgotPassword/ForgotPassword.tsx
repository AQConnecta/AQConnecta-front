import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import FormField from '../../components/FormField'
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../lib/validation'
import { handleApiError } from '../../lib/errors'
import api from '../../services/api'

function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsSubmitting(true)
    try {
      await api.auth.forgotPassword({ email: data.email })
      setEmailSent(true)
    } catch (err) {
      handleApiError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-[420px] shadow-lg border-border/50 animate-scaleIn">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">E-mail enviado!</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Enviamos as instruções de recuperação para
              {' '}
              <strong>{getValues('email')}</strong>
              . Verifique sua caixa de entrada e spam.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o login
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
            <CardTitle className="text-2xl">Recuperar senha</CardTitle>
            <CardDescription className="px-4">
              Informe seu e-mail para receber as instruções de recuperação
            </CardDescription>
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </span>
                ) : 'Enviar instruções'}
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

export default ForgotPassword
