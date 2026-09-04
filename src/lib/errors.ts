import { AxiosError } from 'axios'
import { toast } from 'sonner'

type ApiErrorResponse = {
  message?: string
  data?: Record<string, string> | string | null
  status?: number
}

const GENERIC_MESSAGES: Record<number, string> = {
  400: 'Dados inválidos. Verifique as informações e tente novamente.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Este registro já existe.',
  422: 'Dados inválidos. Verifique os campos e tente novamente.',
  429: 'Muitas tentativas. Aguarde um momento e tente novamente.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.',
}

type ParsedApiError = {
  message: string
  description?: string
  fromBackend: boolean
}

function parseApiErrorDetailed(error: unknown): ParsedApiError {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined

    const backendMessage =
      response?.message && typeof response.message === 'string' && response.message.trim()
        ? response.message.trim()
        : undefined

    const validationDetail =
      response?.data && typeof response.data === 'object' && response.data !== null
        ? Object.values(response.data).filter(Boolean).join('. ') || undefined
        : undefined

    const stringDetail =
      typeof response?.data === 'string' && response.data.trim() ? response.data.trim() : undefined

    if (backendMessage) {
      const description = validationDetail || stringDetail
      return {
        message: backendMessage,
        description: description && description !== backendMessage ? description : undefined,
        fromBackend: true,
      }
    }

    if (validationDetail) {
      return { message: validationDetail, fromBackend: true }
    }

    if (stringDetail) {
      return { message: stringDetail, fromBackend: true }
    }

    const status = error.response?.status
    if (status && GENERIC_MESSAGES[status]) {
      return { message: GENERIC_MESSAGES[status], fromBackend: false }
    }

    if (error.code === 'ERR_NETWORK') {
      return { message: 'Sem conexão com o servidor. Verifique sua internet.', fromBackend: false }
    }

    if (error.code === 'ECONNABORTED') {
      return { message: 'A requisição demorou muito. Tente novamente.', fromBackend: false }
    }
  }

  return { message: 'Ocorreu um erro inesperado. Tente novamente.', fromBackend: false }
}

export function parseApiError(error: unknown): string {
  return parseApiErrorDetailed(error).message
}

export function handleApiError(error: unknown, fallbackMessage?: string) {
  const parsed = parseApiErrorDetailed(error)

  // Backend messages win over the caller's fallback so the user sees the real reason.
  if (parsed.fromBackend) {
    toast.error(parsed.message, parsed.description ? { description: parsed.description } : undefined)
    return
  }

  toast.error(fallbackMessage || parsed.message)
}

export function handleApiSuccess(message: string) {
  toast.success(message)
}
