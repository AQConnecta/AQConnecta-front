import { enqueueSnackbar } from 'notistack';
import api from '../../services/api';

type DeleteHandlerProps = {
    reload: () => void;
    type: string;
    id: string | number;
}

async function deleteGeneric(callbackDelete, callbackReload, id) {
  try {
    await callbackDelete(id);
    callbackReload()
    enqueueSnackbar('Vaga excluída com sucesso', { variant: 'success' });
  } catch (err) {
    enqueueSnackbar('Erro ao excluir a vaga', { variant: 'error' });
  }
}

function DeleteHandler({ reload, type, id }: DeleteHandlerProps) {
  if (type === 'vaga') {
    deleteGeneric(api.vaga.deletarVaga, reload, id)
  }
  if (type === 'universidade') {
    deleteGeneric(api.universidade.deletarUniversidade, reload, id)
  }
  if (type === 'competencia') {
    deleteGeneric(api.competencia.deletarCompetencia, reload, id)
  }
}

export default DeleteHandler;
