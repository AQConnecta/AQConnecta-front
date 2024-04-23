import axios, {removeBearerToken, setBearerToken} from './endpoints/_axios'
import { AuthEndpoint } from './endpoints/auth'
import { CompetenciaEndpoint } from './endpoints/competencia'
import { EnderecoEndpoint } from './endpoints/endereco'

const api = {
  auth: new AuthEndpoint(),
  competencia: new CompetenciaEndpoint(),
  endereco: new EnderecoEndpoint(),
  setBearerToken,
  removeBearerToken,
}

export type Api = typeof api

export default api
export {axios}
