import { useEffect, useState } from 'react';
import { Vaga, VagaRaw } from '../services/endpoints/vaga';
import api from '../services/api';
import { handleApiError } from '../lib/errors';

type UseVagaReturn = {
  vagas: Vaga[];
  reloadVagas: () => void;
  isLoading: boolean;
  error: any;
};

function useVaga(): UseVagaReturn {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  function reloadVagas() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getVagas() {
      try {
        setIsLoading(true);
        const res = await api.vaga.listAll();
        if (res.data.data.length === 0) {
          setVagas([]);
          return;
        }
        let vagasRaw = res.data.data;
        vagasRaw = vagasRaw.map((vaga: VagaRaw) => {
          return {
            ...vaga,
            publicador: typeof vaga.publicador === 'object' ? vaga.publicador.nome : vaga.publicador,
            aceitaRemoto: vaga.aceitaRemoto ? 'Sim' : 'Não',
            iniciante: vaga.iniciante ? 'Sim' : 'Não',
            dataLimiteCandidatura: new Date(vaga.dataLimiteCandidatura).toLocaleDateString('pt-BR'),
            criadoEm: new Date(vaga.criadoEm).toLocaleDateString('pt-BR'),
            atualizadoEm: new Date(vaga.atualizadoEm).toLocaleDateString('pt-BR'),
            competencias: vaga.competencias.map((competencia: { descricao: string }) => competencia.descricao).join(', '),
          };
        });
        setVagas(vagasRaw);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar as vagas');
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
