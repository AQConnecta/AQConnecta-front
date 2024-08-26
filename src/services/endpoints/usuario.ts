import axios from './_axios'
import { Usuario } from "./auth"

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
    
    async buscarUsuarios() {
      return await axios.get('/usuario')
    }
    
    async deletarUsuario(id: number) {
      return await axios.delete(`/usuario/${id}`)
    }
}
