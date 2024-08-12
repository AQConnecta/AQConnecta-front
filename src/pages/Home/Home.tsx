import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import CreateVaga from './components/CreateVaga';

function Home() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);

  useEffect(() => {
    async function getVagas() {
      try {
        const res = await api.competencia.listHotCompetencies();
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as competencias mais usadas', { variant: 'error' });
      }
    }

    getVagas();
  }, []);

  return (
    <Box>
      <CreateVaga />
      {vagas.length ? vagas.map((vaga) => {
        return (
          <Card sx={{ borderBottom: '1px solid #00000014', padding: '0px 24px', width: '100%', backgroundColor: 'white' }}>
            <Box>
              <h1>{vaga.titulo}</h1>
            </Box>
          </Card>
        );
      })
        : (
          <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Nenhuma vaga encontrada</h1>
          </Card>
        )}
    </Box>
  );
}

export default Home;
