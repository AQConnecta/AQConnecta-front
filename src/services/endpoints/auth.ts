import axios from './_axios'

const PREFIX = '/auth'

export type Usuario = {
    id: number;
    nome: string;
    email: string;
}

export type AuthLogin = {
    email: string;
    senha: string;
}

export type LoginResponse = {
    usuario: Usuario;
    token: string;
}

export type RegisterBody = {
    nome: string;
    email: string;
    senha: string;
}

export class AuthEndpoint {
    async login(data: AuthLogin): Promise<LoginResponse> {
        return await axios.post(`${PREFIX}/login`, data)
    }

    async register(data:RegisterBody): Promise<any> {
        return await axios.post(`${PREFIX}/registrar`, data)
    }

    async forgotPassword(data: {email: string}): Promise<any> {
        return await axios.post(`${PREFIX}/recuperando-senha`, data)
    }
}