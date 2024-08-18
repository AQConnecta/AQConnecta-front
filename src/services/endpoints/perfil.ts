import axios from './_axios';

const PREFIX = '/usuario';

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

  async getCurriculos() {
    return await axios.get(`${PREFIX}/curriculos`)
  }
}
