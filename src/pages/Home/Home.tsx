import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
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
        if (!res.data || !res.data.data || res.data.data.length === 0) return;
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
    <Box
      sx={{
        width: '100%',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        maxWidth: { xs: '100%', sm: 640, md: 720 }, // quebra suave
      }}
    >
      <CreateVaga sx={{ width: '100%' }} reloadVagas={reloadVagas} />

      <Stack spacing={2} sx={{ mt: 2 }}>
        {vagas.length ? (
          vagas.map((vaga) => (
            <VagaCard key={vaga.id} vaga={vaga} reloadVagas={reloadVagas} hideButton={false} />
          ))
        ) : (
          <Card
            sx={{
              width: '100%',
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
            }}
          >
            <h1 style={{ fontSize: '1.1rem', margin: 0 }}>Nenhuma vaga encontrada</h1>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

export default Home;
