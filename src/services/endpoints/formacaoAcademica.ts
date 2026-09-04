import axios from './_axios'

const PREFIX = '/formacao_academica'
const PREFIX_UNIVERSIDADE = '/universidade'

export type Universidade = {
    id?: string
    codigoIes: number
    nomeInstituicao: string;
    sigla: string;
    categoriaIes: string;
    organizacaoAcademica: string;
    codigoMunicipioIbge: string;
    municipio: string;
    uf: string;
    situacaoIes: string;
}

export type PartialUniversidade = Partial<Universidade>

export type FormacaoAcademica = {
    id?: string
    universidade: Universidade;
    descricao: string;
    diploma: string;
    dataInicio: string;
    dataFim: string;
    atualFormacao: boolean;

}

export class FormacaoAcademicaEndpoint {
   async getFormacaoAcademica(idUsuario: string) {
    return await axios.get(`${PREFIX}/listar/${idUsuario}`)
   }

   async cadastrarFormacaoAcademica(data: FormacaoAcademica) {
    return await axios.post(`${PREFIX}/cadastrar`, data)
   }

   async alterarFormacaoAcademica(idFormacaoAcademica: string, data: FormacaoAcademica) {
    return await axios.put(`${PREFIX}/alterar/${idFormacaoAcademica}`, data)
   }

   async deletarFormacaoAcademica(idFormacaoAcademica: string) {
    return await axios.delete(`${PREFIX}/deletar/${idFormacaoAcademica}`)
   }

   async localizaFormacaoAcademica(idFormacaoAcademica: string) {
    return await axios.get(`${PREFIX}/localizar/${idFormacaoAcademica}`)
   }

   async uploadDiploma(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return await axios.post(`${PREFIX}/upload-diploma`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
   }
}

export class UniversidadeEndpoint {
    async getUniversidade(search: string = '', page: number = 0, size: number = 20) {
     return await axios.get(`${PREFIX_UNIVERSIDADE}/listar`, { params: { search, page, size } })
    }
 
    async cadastrarUniversidade(data: Universidade) {
     return await axios.post(`${PREFIX_UNIVERSIDADE}/cadastrar`, data)
    }
 
    async alterarUniversidade(idUniversidade: string, data: Universidade) {
     return await axios.put(`${PREFIX_UNIVERSIDADE}/alterar/${idUniversidade}`, data)
    }
 
    async deletarUniversidade(idUniversidade: string) {
     return await axios.delete(`${PREFIX_UNIVERSIDADE}/deletar/${idUniversidade}`)
    }
 
    async localizaUniversidade(idUniversidade:string) {
     return await axios.get(`${PREFIX_UNIVERSIDADE}/localizar/${idUniversidade}`)
    }
 }