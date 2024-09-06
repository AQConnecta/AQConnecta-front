import axios from './_axios';

const PREFIX = '/usuario';

type Curriculo = {
  id: number,
  curriculo: string
  nomeCuriculo: string
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

  async uploadCurriculo(file: File) {
    const formData = new FormData();
    formData.append('file', file);

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
