import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import CreateVaga from './components/CreateVaga';
import VagaCard from '../../components/VagaCard';

function Home() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const [shouldReload, setShouldReload] = useState(0);

  useEffect(() => {
    async function getVagas() {
      try {
        const res = await api.vaga.listAll();
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as vagas', { variant: 'error' });
      }
    }

    getVagas();
  }, [shouldReload]);

  function reloadVagas() {
    setShouldReload((prev) => prev + 1);
  }

  return (
    <Box sx={{ maxWidth: '608px', width: '100%', padding: '0px 16px' }}>
      <CreateVaga sx={{ width: '592px' }} reloadVagas={reloadVagas} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {vagas.length ? vagas.map((vaga) => {
          return (
            <VagaCard vaga={vaga} reloadVagas={reloadVagas} hideButton={false} />
          );
        })
          : (
            <Card sx={{ maxWidth: '576px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1>Nenhuma vaga encontrada</h1>
            </Card>
          )}
      </Box>
    </Box>
  );
}

export default Home;
