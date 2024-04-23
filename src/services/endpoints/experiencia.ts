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
   // async cadastrarEndereco(data: Experiencia) {
   //  return await axios.post(`${PREFIX}/cadastrar`, data)
   // }
   //
   // async alterarEndereco(idUsuario:string ,data: Experiencia) {
   //  return await axios.put(`${PREFIX}/alterar/${idUsuario}`, data)
   // }

   async getExperiencia(idUsuario:string) {
    return await axios.get(`${PREFIX}/listar/${idUsuario}`)
   }
}