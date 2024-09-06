import { enqueueSnackbar } from 'notistack';
import api from '../../services/api';

type DeleteHandlerProps = {
    reload: () => void;
    type: string;
    id: string | number;
}

async function deleteGeneric(callbackDelete, callbackReload, id, type) {
  try {
    await callbackDelete(id);
    callbackReload()
    enqueueSnackbar(`${type} excluída com sucesso`, { variant: 'success' });
  } catch (err) {
    enqueueSnackbar(`Erro ao excluir a ${type}`, { variant: 'error' });
  }
}

function DeleteHandler({ reload, type, id }: DeleteHandlerProps) {
  if (type === 'vaga') {
    deleteGeneric(api.vaga.deletarVaga, reload, id, type)
  }
  if (type === 'universidade') {
    deleteGeneric(api.universidade.deletarUniversidade, reload, id, type)
  }
  if (type === 'competencia') {
    deleteGeneric(api.competencia.deletarCompetencia, reload, id, type)
  }
}

export default DeleteHandler;
