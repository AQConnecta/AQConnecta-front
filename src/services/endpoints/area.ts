import axios, { AxiosResponse } from './_axios'

const PREFIX = '/area'

export type Area = {
  id: string
  descricao: string
}

export class AreaEndpoint {
  async listAll(search: string = '', page: number = 0, size: number = 100): Promise<AxiosResponse<Array<Area>>> {
    return await axios.get(`${PREFIX}/listar`, { params: { search, page, size } })
  }

  async cadastrar(data: { descricao: string }): Promise<void> {
    return await axios.post(`${PREFIX}/cadastrar`, data)
  }

  async alterar(id: string, data: { descricao: string }): Promise<void> {
    return await axios.put(`${PREFIX}/alterar/${id}`, data)
  }

  async deletar(id: string): Promise<void> {
    return await axios.delete(`${PREFIX}/deletar/${id}`)
  }
}
