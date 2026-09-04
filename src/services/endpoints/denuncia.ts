import axios, { AxiosResponse } from './_axios'
import { UsuarioResumo } from './projeto'

const PREFIX = '/denuncia'

export type MotivoDenuncia = 'INFO_FALSA' | 'CONTEUDO_INAPROPRIADO' | 'SPAM' | 'ABUSO' | 'OUTRO'
export type StatusDenuncia = 'PENDENTE' | 'RESOLVIDO' | 'IGNORADO'

export type Denuncia = {
  id: string
  projetoId: string
  projetoTitulo: string
  denunciante: UsuarioResumo | null
  motivo: MotivoDenuncia
  descricao: string | null
  status: StatusDenuncia
  resolvidoPorNome: string | null
  criadoEm: string
  resolvidoEm: string | null
}

export const MOTIVO_LABELS: Record<MotivoDenuncia, string> = {
  INFO_FALSA: 'Informações falsas',
  CONTEUDO_INAPROPRIADO: 'Conteúdo inapropriado',
  SPAM: 'Spam',
  ABUSO: 'Abuso',
  OUTRO: 'Outro',
}

export const MOTIVO_OPTIONS: MotivoDenuncia[] = [
  'INFO_FALSA',
  'CONTEUDO_INAPROPRIADO',
  'SPAM',
  'ABUSO',
  'OUTRO',
]

export const DENUNCIA_STATUS_LABELS: Record<StatusDenuncia, string> = {
  PENDENTE: 'Pendente',
  RESOLVIDO: 'Resolvido',
  IGNORADO: 'Ignorado',
}

export class DenunciaEndpoint {
  async denunciar(idProjeto: string, body: { motivo: MotivoDenuncia; descricao?: string }): Promise<AxiosResponse<null>> {
    return await axios.post(`${PREFIX}/projeto/${idProjeto}`, body)
  }

  async listar(status?: StatusDenuncia, page = 0, size = 20): Promise<AxiosResponse<Array<Denuncia>>> {
    return await axios.get(`${PREFIX}/listar`, { params: { status, page, size } })
  }

  async alterarStatus(idDenuncia: string, status: StatusDenuncia): Promise<AxiosResponse<Denuncia>> {
    return await axios.put(`${PREFIX}/alterar/${idDenuncia}`, { status })
  }
}
