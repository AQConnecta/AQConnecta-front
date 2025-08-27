import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../services/api';

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
  const { enqueueSnackbar } = useSnackbar();

  function reloadCompetencias() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getCompetencias() {
      try {
        setIsLoading(true);
        const res = await api.competencia.listAll();
        if (res.data.data.length === 0) {
          return;
        }
        const competenciasRaw = res.data.data.map((competencia: Competencia) => ({
          id: competencia.id,
          descricao: competencia.descricao,
        }));
        setCompetencias(competenciasRaw);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as competências', { variant: 'error' });
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
