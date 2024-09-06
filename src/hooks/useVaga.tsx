import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Vaga } from '../services/endpoints/vaga';
import api from '../services/api';

type UseVagaReturn = {
    vagas: Vaga[];
    reloadVagas: () => void;
};

function useVaga(): UseVagaReturn {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  function reloadVagas() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getVagas() {
      try {
        setIsLoading(true);
        const res = await api.vaga.listAll();
        if (res.data.data.length === 0) {
          return;
        }
        let vagasRaw = res.data.data;
        vagasRaw = vagasRaw.map((vaga) => {
          return {
            ...vaga,
            publicador: vaga.publicador.nome,
            aceitaRemoto: vaga.aceitaRemoto ? 'Sim' : 'Não',
            iniciante: vaga.iniciante ? 'Sim' : 'Não',
            dataLimiteCandidatura: new Date(vaga.dataLimiteCandidatura).toLocaleDateString('pt-BR'),
            criadoEm: new Date(vaga.criadoEm).toLocaleDateString('pt-BR'),
            atualizadoEm: new Date(vaga.atualizadoEm).toLocaleDateString('pt-BR'),
            competencias: vaga.competencias.map((competencia) => competencia.descricao).join(', '),
          };
        });
        setVagas(vagasRaw);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as vagas', { variant: 'error' });
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getVagas();
  }, [shouldReload]);

  return { vagas, reloadVagas, isLoading, error };
}

export default useVaga;
