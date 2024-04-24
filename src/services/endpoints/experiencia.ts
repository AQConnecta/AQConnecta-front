import axios from './_axios'

const PREFIX = '/experiencia'

export type Experiencia = {
    titulo: string
    instituicao: string
    descricao: string
    dataInicio: string
    dataFim: string
    atualExperiencia: boolean
}

export class ExperienciaEndpoint {
   async getExperiencia(idUsuario:string) {
    return await axios.get(`${PREFIX}/listar/${idUsuario}`)
   }

   async cadastrarExperiencia(data: Experiencia) {
    return await axios.post(`${PREFIX}/cadastrar`, data)
   }

   async alterarExperiencia(idUsuario:string ,data: Experiencia) {
    return await axios.put(`${PREFIX}/alterar/${idUsuario}`, data)
   }

   async deletarExperiencia(idExperiencia:string) {
    return await axios.delete(`${PREFIX}/deletar/${idExperiencia}`)
   }

   async localizaExperiencia(idExperiencia:string) {
    return await axios.get(`${PREFIX}/localizar/${idExperiencia}`)
   }
}