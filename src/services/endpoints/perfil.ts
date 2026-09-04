import axios from './_axios';

const PREFIX = '/usuario';

export type Curriculo = {
  id: string,
  nome: string
  url: string
}

// Backend serializes the JPA entity with its raw column names; remap to the
// shape the UI expects so consumers don't need to know about backend field names.
type RawCurriculo = {
  id: number | string
  nomeCurriculo?: string
  curriculo?: string
  nome?: string
  url?: string
}

function normalizeCurriculo(raw: RawCurriculo): Curriculo {
  return {
    id: String(raw.id),
    nome: raw.nomeCurriculo ?? raw.nome ?? '',
    url: raw.curriculo ?? raw.url ?? '',
  }
}

export class PerfilEndpoint {
  async uploadImagemPerfil(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return await axios.post(`${PREFIX}/upload-imagem-perfil`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadCurriculo(file: File, nome: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nome', nome);

    return await axios.post(`${PREFIX}/anexar-curriculo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getCurriculos(): Promise<{ data: { data: Curriculo[] } }> {
    const response = await axios.get(`${PREFIX}/curriculos`)
    const raw: RawCurriculo[] = response.data?.data ?? []
    return {
      ...response,
      data: { ...response.data, data: raw.map(normalizeCurriculo) },
    }
  }

  async listarMinhasCandidaturas() {
    return await axios.get(`${PREFIX}/candidaturas`)
  }
}
