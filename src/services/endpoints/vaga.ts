import axios from './_axios'
import { Usuario } from './auth'
import { Competencia } from './competencia'

const PREFIX = '/vaga'

export type Vaga = {
    id?: string
    publicador: Usuario
    titulo: string
    descricao: string
    localDaVaga: string
    aceitaRemoto: boolean
    dataLimiteCandidatura: Date | string
    criadoEm: Date | string
    curriculoUrl: string
    atualizadoEm: Date | string
    deletadoEm: Date | string
    usuario?: Usuario
    competencias?: Array<Competencia>
    iniciante: boolean
}

export type PartialVaga = Partial<Vaga>

export class VagaEndpoint {
    async listAll() {
        return await axios.get(`${PREFIX}/listar`)
    }

    async listAllWithFilters(titulo: string | null, idCompetencia: string | null) {
        return await axios.get(`${PREFIX}/listar`, {
            params: { titulo: titulo, idCompetencia: idCompetencia }
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
}