import axios, {removeBearerToken, setBearerToken} from './endpoints/_axios'
import { AuthEndpoint } from './endpoints/auth'
import { CompetenciaEndpoint } from './endpoints/competencia'
import { EnderecoEndpoint } from './endpoints/endereco'
import {ExperienciaEndpoint} from "./endpoints/experiencia.ts";
import { FormacaoAcademicaEndpoint, UniversidadeEndpoint } from './endpoints/formacaoAcademica.ts';
import { PerfilEndpoint } from './endpoints/perfil.ts';
import { UsuarioEndpoint } from './endpoints/usuario.ts';
import { VagaEndpoint } from './endpoints/vaga.ts';
import { AreaEndpoint } from './endpoints/area';
import { ProjetoEndpoint } from './endpoints/projeto';
import { PostagemEndpoint } from './endpoints/postagem';
import { DenunciaEndpoint } from './endpoints/denuncia';

const api = {
  auth: new AuthEndpoint(),
  competencia: new CompetenciaEndpoint(),
  endereco: new EnderecoEndpoint(),
  experiencia: new ExperienciaEndpoint(),
  formacaoAcademica: new FormacaoAcademicaEndpoint(),
  universidade: new UniversidadeEndpoint(),
  vaga: new VagaEndpoint(),
  usuario: new UsuarioEndpoint(),
  perfil: new PerfilEndpoint(),
  area: new AreaEndpoint(),
  projeto: new ProjetoEndpoint(),
  postagem: new PostagemEndpoint(),
  denuncia: new DenunciaEndpoint(),
  setBearerToken,
  removeBearerToken,
}

export type Api = typeof api

export default api
export {axios}
