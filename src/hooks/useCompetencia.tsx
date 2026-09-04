import { useEffect, useState } from 'react';
import api from '../services/api';
import { handleApiError } from '../lib/errors';

type Competencia = {
  id: string;
  descricao: string;
};

type UseCompetenciaReturn = {
  competencias: Competencia[];
  reloadCompetencias: () => void;
  isLoading: boolean;
  error: any;
};

function useCompetencia(): UseCompetenciaReturn {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  function reloadCompetencias() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getCompetencias() {
      try {
        setIsLoading(true);
        const res = await api.competencia.listAll();
        if (res.data.data.length === 0) {
          setCompetencias([]);
          return;
        }
        const competenciasRaw = res.data.data.map((competencia: Competencia) => ({
          id: competencia.id,
          descricao: competencia.descricao,
        }));
        setCompetencias(competenciasRaw);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar as competências');
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCompetencias();
  }, [shouldReload]);

  return { competencias, reloadCompetencias, isLoading, error };
}

export default useCompetencia;
