import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import VagaCard from '../../components/VagaCard';

function MinhasVagas() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const { user } = useAuth();

  function reloadVagas() {
    setShouldReload((prev) => prev + 1);
  }

  useEffect(() => {
    async function getMinhasVagas() {
      try {
        const res = await api.vaga.listByUser(user?.id!);
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as suas vagas', { variant: 'error' });
      }
    }

    getMinhasVagas();
  }, [user, shouldReload]);

  return (
    <Box sx={{ maxWidth: '608px', width: '100%', padding: '0px 16px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {vagas.length ? vagas.map((vaga) => {
          return (
            <VagaCard vaga={vaga} reloadVagas={reloadVagas} hideButton />
          );
        })
          : (
            <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1>Nenhuma vaga encontrada</h1>
            </Card>
          )}
      </Box>
    </Box>
  );
}

export default MinhasVagas;
