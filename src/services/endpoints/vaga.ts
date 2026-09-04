import axios from './_axios'
import { Usuario } from './auth'
import { Competencia, AreaAtuacao } from './competencia'

const PREFIX = '/vaga'

export type Vaga = {
    id?: string
    publicador: Usuario | string
    titulo: string
    descricao: string
    localDaVaga: string
    aceitaRemoto: boolean
    dataLimiteCandidatura: string
    criadoEm: string
    curriculoUrl: string
    atualizadoEm: string
    deletadoEm: string
    usuario?: Usuario
    competencias?: Array<Competencia>
    iniciante: boolean
    idProjeto?: string
    projetoId?: string
    projetoTitulo?: string
    areaAtuacao?: AreaAtuacao
}

// Raw type for API response before transformation
export type VagaRaw = Vaga & {
    competencias: Array<{ descricao: string; id?: string }>
}

export type PartialVaga = Partial<Vaga>

export class VagaEndpoint {
    async listAll() {
        return await axios.get(`${PREFIX}/listar`)
    }

    async listAllWithFilters(titulo: string | null, idCompetencia: string | null, iniciante: string | null) {
        return await axios.get(`${PREFIX}/listar`, {
            params: { titulo: titulo, idCompetencia: idCompetencia, iniciante: iniciante }
        })
    }

    async listByUser(idUsuario: string) {
        return await axios.get(`${PREFIX}/listar/${idUsuario}`)
    }

    async cadastrarVaga(data: Vaga) {
        return await axios.post(`${PREFIX}/cadastrar`, data)
    }

    async alterarVaga(idVaga: string, data: Vaga) {
        return await axios.put(`${PREFIX}/alterar/${idVaga}`, data)
    }

    async deletarVaga(idVaga: string) {
        return await axios.delete(`${PREFIX}/deletar/${idVaga}`)
    }

    async localizarVaga(idVaga: string) {
        return await axios.get(`${PREFIX}/localizar/${idVaga}`)
    }

    async candidatarVaga(idVaga: string, curriculoId: string) {
        return await axios.post(`${PREFIX}/candidatar/${idVaga}`, curriculoId, {
            headers: {
              'Content-Type': 'application/json',
            },
        });
    }

    async listarCandidatos(idVaga:string) {
        return await axios.get(`${PREFIX}/candidaturas/${idVaga}`)
    }

    async listByProjeto(idProjeto: string) {
        return await axios.get(`${PREFIX}/por-projeto/${idProjeto}`)
    }
}