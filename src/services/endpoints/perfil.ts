import axios from './_axios';

const PREFIX = '/usuario';

export type Curriculo = {
  id: number,
  curriculo: string
  nomeCurriculo: string
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
    return await axios.get(`${PREFIX}/curriculos`)
  }

  async listarMinhasCandidaturas() {
    return await axios.get(`${PREFIX}/candidaturas`)
  }
}
