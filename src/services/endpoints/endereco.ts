import axios from './_axios'

const PREFIX = '/endereco'

export type Endereco = {
    cep: string
    rua: string
    bairro: string
    cidade: string
    estado: string
    pais: string
    numeroCasa: string
    complemento: string
}

export class EnderecoEndpoint {
   async cadastrarEndereco(data: Endereco) {
    return await axios.post(`${PREFIX}/cadastrar`, data)
   }

   async alterarEndereco(idUsuario:string ,data: Endereco) {
    return await axios.put(`${PREFIX}/alterar/${idUsuario}`, data)
   }

   async getEndereco(idUsuario:string) {
    return await axios.get(`${PREFIX}/listar/${idUsuario}`)
   }
}