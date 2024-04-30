import axios, { AxiosResponse } from './_axios'

const PREFIX = '/competencia'

export type Competencia = {
    id: string
    descricao: string
}

export class CompetenciaEndpoint {
    async listAll(): Promise<AxiosResponse<Array<Competencia>>> {
        return await axios.get(`${PREFIX}/listar`)
    }

    async listByUserId(userId: string): Promise<AxiosResponse<Array<Competencia>>> {
        return await axios.get(`${PREFIX}/listar/${userId}`)
    }

    async linkCompetenciaToMe(data: {competencias: Array<{id: string}>}): Promise<any> {
        return await axios.post(`${PREFIX}/relacionar_competencia_usuario`, data)
    }

    async removeCompetenciaFromMe(data: {competencias: Array<{id: string}>}): Promise<any> {
        return await axios.delete(`${PREFIX}/remover_relacao_usuario`, { data })
    }
}