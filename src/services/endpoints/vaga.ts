import axios from './_axios'
import { Usuario } from './auth'

const PREFIX = '/vaga'

export type Vaga = {
    id?: string
    publicador: Usuario
    titulo: string
    descricao: string
    localDaVaga: string
    aceitaRemoto: boolean
    dataLimiteCandidatura: Date
    criadoEm: Date
    atualizadoEm: Date
    deletadoEm: Date
}

export class VagaEndpoint {
    async listAll() {
        return await axios.get(`${PREFIX}/listar`)
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
}