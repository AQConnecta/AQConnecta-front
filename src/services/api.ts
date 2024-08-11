import axios, {removeBearerToken, setBearerToken} from './endpoints/_axios'
import { AuthEndpoint } from './endpoints/auth'
import { CompetenciaEndpoint } from './endpoints/competencia'
import { EnderecoEndpoint } from './endpoints/endereco'
import {ExperienciaEndpoint} from "./endpoints/experiencia.ts";
import { FormacaoAcademicaEndpoint, UniversidadeEndpoint } from './endpoints/formacaoAcademica.ts';

const api = {
  auth: new AuthEndpoint(),
  competencia: new CompetenciaEndpoint(),
  endereco: new EnderecoEndpoint(),
  experiencia: new ExperienciaEndpoint(),
  formacaoAcademica: new FormacaoAcademicaEndpoint(),
  universidade: new UniversidadeEndpoint(),
  setBearerToken,
  removeBearerToken,
}

export type Api = typeof api

export default api
export {axios}
