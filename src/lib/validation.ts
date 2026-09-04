import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido'),
  senha: z
    .string()
    .min(1, 'Senha é obrigatória'),
})

export const registerSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido'),
  senha: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  confirmarSenha: z
    .string()
    .min(1, 'Confirme sua senha'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido'),
})

export const resetPasswordSchema = z.object({
  senha: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  confirmarSenha: z
    .string()
    .min(1, 'Confirme sua senha'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
})

export const vagaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória'),
  localDaVaga: z
    .string()
    .min(1, 'Local da vaga é obrigatório'),
  aceitaRemoto: z.boolean(),
  dataLimiteCandidatura: z
    .string()
    .optional(),
  isIniciante: z.boolean(),
})

export const enderecoSchema = z.object({
  cep: z
    .string()
    .min(1, 'CEP é obrigatório')
    .max(10, 'CEP inválido'),
  rua: z
    .string()
    .min(1, 'Rua é obrigatória'),
  bairro: z
    .string()
    .min(1, 'Bairro é obrigatório'),
  cidade: z
    .string()
    .min(1, 'Cidade é obrigatória'),
  estado: z
    .string()
    .min(1, 'Estado é obrigatório'),
  pais: z
    .string()
    .min(1, 'País é obrigatório'),
  numeroCasa: z
    .string()
    .min(1, 'Número é obrigatório'),
  complemento: z
    .string()
    .optional(),
})

export const experienciaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'Título é obrigatório'),
  instituicao: z
    .string()
    .min(1, 'Instituição é obrigatória'),
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória'),
  dataInicio: z
    .string()
    .min(1, 'Data de início é obrigatória'),
  dataFim: z
    .string()
    .optional(),
  atualExperiencia: z.boolean(),
})

export const formacaoAcademicaSchema = z.object({
  universidade: z
    .string()
    .min(1, 'Universidade é obrigatória'),
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória'),
  diploma: z
    .string()
    .min(1, 'Diploma é obrigatório'),
  dataInicio: z
    .string()
    .min(1, 'Data de início é obrigatória'),
  dataFim: z
    .string()
    .optional(),
  atualFormacao: z.boolean(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type VagaFormData = z.infer<typeof vagaSchema>
export type EnderecoFormData = z.infer<typeof enderecoSchema>
export type ExperienciaFormData = z.infer<typeof experienciaSchema>
export type FormacaoAcademicaFormData = z.infer<typeof formacaoAcademicaSchema>
