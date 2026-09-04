import { useEffect, useState } from 'react';
import api from '../services/api';
import { Universidade } from '../services/endpoints/formacaoAcademica';
import { handleApiError } from '../lib/errors';

type UseUniversidadeReturn = {
  universidades: Universidade[];
  reloadUniversidades: () => void;
  isLoading: boolean;
  error: any;
};

function useUniversidade(): UseUniversidadeReturn {
  const [universidades, setUniversidades] = useState<Universidade[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  function reloadUniversidades() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getUniversidades() {
      try {
        setIsLoading(true);
        const res = await api.universidade.getUniversidade();
        if (res.data.data.length === 0) {
          setUniversidades([]);
          setIsLoading(false);
          return;
        }
        const universidadesRaw = res.data.data;
        setUniversidades(universidadesRaw);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar as universidades');
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getUniversidades();
  }, [shouldReload]);

  return { universidades, reloadUniversidades, isLoading, error };
}

export default useUniversidade;
