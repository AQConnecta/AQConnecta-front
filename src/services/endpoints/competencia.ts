import axios, { AxiosResponse } from './_axios'

const PREFIX = '/competencia'

export type Competencia = {
    id: string
    descricao: string
}

export type CompetenciaLevel = {
    competencia: Competencia,
    level: number
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
    
    async listHotCompetencies(): Promise<AxiosResponse<Array<CompetenciaLevel>>> {
        return await axios.get(`${PREFIX}/competencias_quentes`)
    }

    async linkCompetenciaVaga(data: {competencias: Array<Competencia>, idVaga: string}): Promise<any> {
        return await axios.post(`${PREFIX}/relacionar_competencia_vaga`, data)
    }
}