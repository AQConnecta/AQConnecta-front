import { toast } from 'sonner';
import api from '../../services/api';
import { handleApiError } from '../../lib/errors';

type DeleteHandlerProps = {
  reload: () => void;
  type: string;
  id: string | number;
};

async function deleteGeneric(
  callbackDelete: (id: string) => Promise<any>,
  callbackReload: () => void,
  id: string | number,
  type: string,
) {
  try {
    await callbackDelete(String(id));
    callbackReload();
    toast.success(`${type} excluída com sucesso`);
  } catch (err) {
    handleApiError(err, `Erro ao excluir a ${type}`);
  }
}

function DeleteHandler({ reload, type, id }: DeleteHandlerProps) {
  if (type === 'vaga') {
    deleteGeneric(api.vaga.deletarVaga, reload, id, type);
  }
  if (type === 'universidade') {
    deleteGeneric(api.universidade.deletarUniversidade, reload, id, type);
  }
  if (type === 'competencia') {
    deleteGeneric(api.competencia.deletarCompetencia, reload, id, type);
  }
}

export default DeleteHandler;
