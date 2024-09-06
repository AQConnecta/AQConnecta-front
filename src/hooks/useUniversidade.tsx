import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../services/api';
import { Universidade } from '../services/endpoints/formacaoAcademica';

type UseUniversidadeReturn = {
  universidades: Universidade[];
  reloadUniversidades: () => void;
  isLoading: boolean;
  error: any;
};

function useUniversidade(): UseUniversidadeReturn {
  const [universidades, setUniversidades] = useState<Universidade[] | null>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  function reloadUniversidades() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getUniversidades() {
      try {
        setIsLoading(true);
        const res = await api.universidade.getUniversidade();
        if (res.data.data.length === 0) {
          return;
        }
        let universidadesRaw = res.data.data;
        universidadesRaw = universidadesRaw.map((universidade) => {
          return {
            ...universidade,
            codigoIes: universidade.codigoIes,
            nomeInstituicao: universidade.nomeInstituicao,
            sigla: universidade.sigla,
            categoriaIes: universidade.categoriaIes,
            organizacaoAcademica: universidade.organizacaoAcademica,
            codigoMunicipioIbge: universidade.codigoMunicipioIbge,
            municipio: universidade.municipio,
            uf: universidade.uf,
            situacaoIes: universidade.situacaoIes,
          };
        });
        setUniversidades(universidadesRaw);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as universidades', { variant: 'error' });
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
