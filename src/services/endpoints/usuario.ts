import axios from './_axios'
import { Usuario } from "./auth"
import { Competencia } from './competencia';
import { FormacaoAcademica } from './formacaoAcademica';
import { Experiencia } from './experiencia';

// Tive que fazer isso pra n quebrar nada que eu nao entenda aqui
export type UsuarioFilter = {
  id: string;
  nome: string;
  email: string;
  descricao: string;
  fotoPerfil: string;
  competencias: Competencia[]
  experiencias: Experiencia[];
  formacoesAcademicas: FormacaoAcademica[];
  userUrl: string
  deletado: boolean;
  ativado: boolean;
}

export class UsuarioEndpoint {
    async cadastrarUsuario(usuario: Usuario) {
      return await axios.post('/usuario', usuario)
    }

    async atualizarUsuario(usuario: Usuario) {
      return await axios.put(`/usuario/${usuario.id}`, usuario)
    }
    
    async getUsuario(id: string) {
      return await axios.get(`/usuario/${id}`)
    }
    
    async filtrarUsuarios(userUrl: string | null = '') {
      return await axios.get(`/usuario/listar`, {
        params: { userUrl }
      })
    }

    async localizarPorUrl(userUrl: string) {
      return await axios.get(`/usuario/${userUrl}`)
    }
    
    async deletarUsuario(id: number) {
      return await axios.delete(`/usuario/${id}`)
    }
}
