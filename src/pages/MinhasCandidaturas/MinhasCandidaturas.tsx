import { useEffect, useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function MinhasCandidaturas() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function getCandidaturas() {
      try {
        const res = await api.perfil.listarMinhasCandidaturas(); // Ajuste o endpoint conforme necessário
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as candidaturas', { variant: 'error' });
      }
    }

    getCandidaturas();
  }, [user]);

  return (
    <Box sx={{ maxWidth: '608px', width: '100%', padding: '0px 16px' }}>
      {vagas.length ? vagas.map((vaga) => (
        <Card sx={{ borderBottom: '1px solid #00000014', padding: '0px 24px', width: '560px', backgroundColor: 'white' }} key={vaga.id}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0px 16px 0px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>{vaga.titulo}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic' }}>
                Criado por
                {' '}
                {vaga.publicador.nome}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                  {vaga.localDaVaga}
                </Typography>
              </Box>
              <Chip label={vaga.aceitaRemoto ? 'Vaga remota' : 'Vaga presencial'} sx={{ backgroundColor: '#dad5fc', height: '24px', width: '118px' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Sobre a vaga:</Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{vaga.descricao}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Competências:</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                {vaga.competencias?.map((competencia) => (
                  <Chip label={competencia.descricao} sx={{ backgroundColor: '#dad5fc', height: '24px' }} key={competencia.id} />
                ))}
              </Box>
            </Box>
          </Box>
        </Card>
      )) : (
        <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Nenhuma candidatura encontrada</h1>
        </Card>
      )}
    </Box>
  );
}

export default MinhasCandidaturas;
