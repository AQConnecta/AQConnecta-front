import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Competencia } from '../../services/endpoints/competencia';
import { enqueueSnackbar } from 'notistack';
import { Usuario } from '../../services/endpoints/auth';
import { Endereco } from '../../services/endpoints/endereco';
import { useNavigate } from 'react-router-dom';

const columns: GridColDef[] = [{ field: 'descricao', headerName: 'Descrição' }];

function MeuEndereco() {
  const user: Usuario = JSON.parse(localStorage.getItem('user') || '{}');
  const [endereco, setEndereco] = useState<Endereco>({} as Endereco);
    const navigate = useNavigate();

  useEffect(() => {
    async function getEndereco() {
      try {
        const res = await api.endereco.getEndereco(user.id);
        setEndereco(res.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar endereço', { variant: 'error' });
      }
    }

    getEndereco();
  });

  function handleRegisterClick() {
    navigate('register')
  }

  return (
    <Box
      height="100%"
      width="100%"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        width="100%"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 2px #0003',
          backgroundColor: 'white',
          maxWidth: '350px',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        {endereco ? (
          <Box>
            <Typography variant="h6">Endereço</Typography>
            <Typography variant="body1">Rua: Rua do Endereço</Typography>
            <Typography variant="body1">Número: 123</Typography>
            <Typography variant="body1">Bairro: Bairro do Endereço</Typography>
            <Typography variant="body1">Cidade: Cidade do Endereço</Typography>
            <Typography variant="body1">Estado: Estado do Endereço</Typography>
            <Typography variant="body1">CEP: 12345-678</Typography>
            <Button variant="contained" sx={{ width: '100%', height: '50px' }}>
              Editar
            </Button>
          </Box>
        ) : (
            <Box>
          <Typography variant="body1">Endereço não encontrado</Typography>
          <Button variant='contained' onClick={() => handleRegisterClick()}>Cadastrar endereço</Button>
            </Box>
        )}
      </Box>
    </Box>
  );
}

export default MeuEndereco;
