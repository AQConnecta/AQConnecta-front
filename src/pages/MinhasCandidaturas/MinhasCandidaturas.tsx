import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import VagaCard from '../../components/VagaCard';
import { handleApiError } from '../../lib/errors';

function MinhasCandidaturas() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const { user } = useAuth();

  function reloadVagas() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getCandidaturas() {
      try {
        const res = await api.perfil.listarMinhasCandidaturas();
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar as candidaturas');
      }
    }

    getCandidaturas();
  }, [user, shouldReload]);

  return (
    <div className="max-w-[608px] w-full px-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Minhas Candidaturas</h1>
      <div className="flex flex-col gap-4">
        {vagas.length ? (
          vagas.map((vaga) => (
            <VagaCard key={vaga.id} vaga={vaga} reloadVagas={reloadVagas} hideButton />
          ))
        ) : (
          <Card className="w-full">
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-lg">Nenhuma candidatura encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default MinhasCandidaturas;
