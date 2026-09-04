import axios, { AxiosResponse } from './_axios'
import { ProjetoImagem, UsuarioResumo } from './projeto'

const prefix = (idProjeto: string) => `/projeto/${idProjeto}/posts`

export type StatusPostagem = 'PUBLICADO' | 'RASCUNHO'

export type PostagemResumo = {
  id: string
  projetoId: string
  titulo: string
  status: StatusPostagem
  autor: UsuarioResumo | null
  capaUrl: string | null
  totalComentarios: number
  publicadoEm: string | null
  criadoEm: string
}

export type Postagem = {
  id: string
  projetoId: string
  titulo: string
  corpo: string
  status: StatusPostagem
  autor: UsuarioResumo | null
  imagens: ProjetoImagem[]
  totalComentarios: number
  podeEditar: boolean
  publicadoEm: string | null
  criadoEm: string
  atualizadoEm: string
}

export type PostagemFormBody = {
  titulo: string
  corpo: string
  status?: StatusPostagem
}

export type Comentario = {
  id: string
  corpo: string
  autor: UsuarioResumo | null
  podeDeletar: boolean
  criadoEm: string
  respostas: Comentario[]
}

export type ComentarioFormBody = {
  corpo: string
  idComentarioPai?: string
}

export const POST_STATUS_LABELS: Record<StatusPostagem, string> = {
  PUBLICADO: 'Publicado',
  RASCUNHO: 'Rascunho',
}

export class PostagemEndpoint {
  async listar(idProjeto: string, page = 0, size = 10): Promise<AxiosResponse<Array<PostagemResumo>>> {
    return await axios.get(prefix(idProjeto), { params: { page, size } })
  }

  async localizar(idProjeto: string, idPost: string): Promise<AxiosResponse<Postagem>> {
    return await axios.get(`${prefix(idProjeto)}/${idPost}`)
  }

  async criar(idProjeto: string, body: PostagemFormBody): Promise<AxiosResponse<Postagem>> {
    return await axios.post(prefix(idProjeto), body)
  }

  async alterar(idProjeto: string, idPost: string, body: PostagemFormBody): Promise<AxiosResponse<Postagem>> {
    return await axios.put(`${prefix(idProjeto)}/${idPost}`, body)
  }

  async deletar(idProjeto: string, idPost: string): Promise<AxiosResponse<null>> {
    return await axios.delete(`${prefix(idProjeto)}/${idPost}`)
  }

  async adicionarImagem(idProjeto: string, idPost: string, file: File): Promise<AxiosResponse<ProjetoImagem>> {
    const formData = new FormData()
    formData.append('file', file)
    return await axios.post(`${prefix(idProjeto)}/${idPost}/imagens`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async removerImagem(idProjeto: string, idPost: string, idImagem: string): Promise<AxiosResponse<null>> {
    return await axios.delete(`${prefix(idProjeto)}/${idPost}/imagens/${idImagem}`)
  }

  async listarComentarios(idProjeto: string, idPost: string, page = 0, size = 20): Promise<AxiosResponse<Array<Comentario>>> {
    return await axios.get(`${prefix(idProjeto)}/${idPost}/comentarios`, { params: { page, size } })
  }

  async comentar(idProjeto: string, idPost: string, body: ComentarioFormBody): Promise<AxiosResponse<Comentario>> {
    return await axios.post(`${prefix(idProjeto)}/${idPost}/comentarios`, body)
  }

  async deletarComentario(idProjeto: string, idPost: string, idComentario: string): Promise<AxiosResponse<null>> {
    return await axios.delete(`${prefix(idProjeto)}/${idPost}/comentarios/${idComentario}`)
  }
}
