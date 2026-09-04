import axios, { AxiosResponse } from './_axios'
import { Area } from './area'
import { Usuario } from './auth'
import { Universidade } from './formacaoAcademica'

export type ProjetoLink = {
  id?: string
  titulo?: string
  url: string
}

const PREFIX = '/projeto'

export type StatusProjeto = 'ATIVO' | 'EM_PAUSA' | 'ENCERRADO'
export type VisibilidadeProjeto = 'PUBLICO' | 'PRIVADO'
export type PapelProjeto = 'DONO' | 'EDITOR' | 'VISUALIZADOR'

export type ProjetoImagem = {
  id: string
  url: string
  ordem: number
}

export type ProjetoResumo = {
  id: string
  titulo: string
  descricao: string
  area: Area | null
  universidade: Universidade | null
  status: StatusProjeto
  visibilidade: VisibilidadeProjeto
  capaUrl: string | null
  donoId: string
  donoNome: string
  criadoEm: string
}

export type Projeto = {
  id: string
  titulo: string
  descricao: string
  area: Area | null
  universidade: Universidade | null
  status: StatusProjeto
  visibilidade: VisibilidadeProjeto
  capaUrl: string | null
  dono: Usuario | null
  papelUsuarioAtual: PapelProjeto | null
  imagens: ProjetoImagem[]
  links: ProjetoLink[]
  totalMembros: number
  totalSeguidores: number
  seguindo: boolean
  criadoEm: string
  atualizadoEm: string
}

export type ProjetoFormBody = {
  titulo: string
  descricao: string
  idArea: string
  idUniversidade?: string
  links?: ProjetoLink[]
  status?: StatusProjeto
  visibilidade?: VisibilidadeProjeto
}

export type ListarProjetosParams = {
  titulo?: string
  idArea?: string
  status?: string
  page?: number
  size?: number
}

export type UsuarioResumo = {
  id: string
  nome: string
  email: string
  fotoPerfil?: string | null
  userUrl?: string | null
}

export type Membro = {
  id: string | null
  usuario: UsuarioResumo | null
  papel: PapelProjeto
  ativo: boolean
  dataEntrada: string | null
  dataSaida: string | null
}

export type MembrosResponse = {
  dono: Membro
  membros: Membro[]
}

export type StatusConvite = 'PENDENTE' | 'ACEITO' | 'RECUSADO'

export type Convite = {
  id: string
  projetoId: string
  projetoTitulo: string
  projetoCapaUrl: string | null
  usuario: UsuarioResumo | null
  convidadoPorNome: string
  papel: PapelProjeto
  status: StatusConvite
  criadoEm: string
}

export const STATUS_LABELS: Record<StatusProjeto, string> = {
  ATIVO: 'Ativo',
  EM_PAUSA: 'Em pausa',
  ENCERRADO: 'Encerrado',
}

export const STATUS_OPTIONS: StatusProjeto[] = ['ATIVO', 'EM_PAUSA', 'ENCERRADO']

export const VISIBILIDADE_LABELS: Record<VisibilidadeProjeto, string> = {
  PUBLICO: 'Público',
  PRIVADO: 'Privado',
}

export const PAPEL_LABELS: Record<PapelProjeto, string> = {
  DONO: 'Dono',
  EDITOR: 'Editor',
  VISUALIZADOR: 'Visualizador',
}

export function statusVariant(status: StatusProjeto): 'success' | 'warning' | 'secondary' {
  if (status === 'ATIVO') return 'success'
  if (status === 'EM_PAUSA') return 'warning'
  return 'secondary'
}

export function podeGerenciar(papel: PapelProjeto | null): boolean {
  return papel === 'DONO' || papel === 'EDITOR'
}

export class ProjetoEndpoint {
  async listar(params: ListarProjetosParams = {}): Promise<AxiosResponse<Array<ProjetoResumo>>> {
    return await axios.get(`${PREFIX}/listar`, { params })
  }

  async listarMeus(): Promise<AxiosResponse<Array<ProjetoResumo>>> {
    return await axios.get(`${PREFIX}/meus`)
  }

  async localizar(id: string): Promise<AxiosResponse<Projeto>> {
    return await axios.get(`${PREFIX}/localizar/${id}`)
  }

  async cadastrar(data: ProjetoFormBody): Promise<AxiosResponse<Projeto>> {
    return await axios.post(`${PREFIX}/cadastrar`, data)
  }

  async alterar(id: string, data: ProjetoFormBody): Promise<AxiosResponse<Projeto>> {
    return await axios.put(`${PREFIX}/alterar/${id}`, data)
  }

  async deletar(id: string): Promise<AxiosResponse<null>> {
    return await axios.delete(`${PREFIX}/deletar/${id}`)
  }

  async uploadCapa(id: string, file: File): Promise<AxiosResponse<string>> {
    const formData = new FormData()
    formData.append('file', file)
    return await axios.post(`${PREFIX}/${id}/capa`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async adicionarImagem(id: string, file: File): Promise<AxiosResponse<ProjetoImagem>> {
    const formData = new FormData()
    formData.append('file', file)
    return await axios.post(`${PREFIX}/${id}/galeria`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async removerImagem(id: string, idImagem: string): Promise<AxiosResponse<null>> {
    return await axios.delete(`${PREFIX}/${id}/galeria/${idImagem}`)
  }

  async listarMembros(id: string, page = 0, size = 20): Promise<AxiosResponse<MembrosResponse>> {
    return await axios.get(`${PREFIX}/${id}/membros`, { params: { page, size } })
  }

  async buscarUsuarios(id: string, q: string): Promise<AxiosResponse<Array<UsuarioResumo>>> {
    return await axios.get(`${PREFIX}/${id}/membros/buscar`, { params: { q } })
  }

  async convidar(id: string, body: { idUsuario?: string; email?: string; papel: PapelProjeto }): Promise<AxiosResponse<Convite>> {
    return await axios.post(`${PREFIX}/${id}/convites`, body)
  }

  async listarConvitesProjeto(id: string): Promise<AxiosResponse<Array<Convite>>> {
    return await axios.get(`${PREFIX}/${id}/convites`)
  }

  async listarMeusConvites(): Promise<AxiosResponse<Array<Convite>>> {
    return await axios.get(`${PREFIX}/convites/meus`)
  }

  async aceitarConvite(idConvite: string): Promise<AxiosResponse<null>> {
    return await axios.post(`${PREFIX}/convites/${idConvite}/aceitar`)
  }

  async recusarConvite(idConvite: string): Promise<AxiosResponse<null>> {
    return await axios.post(`${PREFIX}/convites/${idConvite}/recusar`)
  }

  async alterarPapelMembro(id: string, idMembro: string, papel: PapelProjeto): Promise<AxiosResponse<Membro>> {
    return await axios.put(`${PREFIX}/${id}/membros/${idMembro}/papel`, { papel })
  }

  async removerMembro(id: string, idMembro: string): Promise<AxiosResponse<null>> {
    return await axios.delete(`${PREFIX}/${id}/membros/${idMembro}`)
  }

  async reativarMembro(id: string, idMembro: string): Promise<AxiosResponse<Membro>> {
    return await axios.post(`${PREFIX}/${id}/membros/${idMembro}/reativar`)
  }

  async transferirOwnership(id: string, idNovoDono: string): Promise<AxiosResponse<null>> {
    return await axios.post(`${PREFIX}/${id}/transferir/${idNovoDono}`)
  }

  async seguir(id: string): Promise<AxiosResponse<number>> {
    return await axios.post(`${PREFIX}/${id}/seguir`)
  }

  async deixarDeSeguir(id: string): Promise<AxiosResponse<number>> {
    return await axios.delete(`${PREFIX}/${id}/seguir`)
  }

  async listarSeguidos(): Promise<AxiosResponse<Array<ProjetoResumo>>> {
    return await axios.get(`${PREFIX}/seguidos`)
  }
}
