import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Usuario } from '../../services/endpoints/auth';
import { Endereco } from '../../services/endpoints/endereco';

function MeuEndereco() {
  const user: Usuario = JSON.parse(localStorage.getItem('user') || '{}');
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function getEndereco() {
      try {
        const res = await api.endereco.getEndereco(user.id);
        setEnderecos(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar endereço', { variant: 'error' });
      }
    }

    getEndereco();
  }, [shouldReload]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function handleRegisterClick() {
    navigate('register');
  }

  async function handleDelete(idEndereco:string) {
    try {
      await api.endereco.deletarEndereco(idEndereco);
      enqueueSnackbar('Endereço deletada com sucesso', { variant: 'success' });
      reload()
    } catch (err) {
      enqueueSnackbar('Erro ao deletar endereço', { variant: 'error' });
    }
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
        <Button variant="contained" onClick={() => navigate('register')}>Cadastrar endereço</Button>

        {enderecos && enderecos.length > 0 ? (
          enderecos.map((endereco:Endereco, index:number) => (
            <Box key={index} sx={{ padding: '8px', border: '1px solid #000', borderRadius: '5px' }}>
              <Typography variant="h6">
                Endereço
                {index + 1}
              </Typography>
              <Box sx={{ padding: '8px' }}>
                <Typography variant="body1">
                  Rua:
                  {endereco.rua}
                </Typography>
                <Typography variant="body1">
                  Número:
                  {' '}
                  {endereco.numeroCasa}
                </Typography>
                <Typography variant="body1">
                  Bairro:
                  {endereco.bairro}
                </Typography>
                <Typography variant="body1">
                  Cidade:
                  {endereco.cidade}
                </Typography>
                <Typography variant="body1">
                  Estado:
                  {endereco.estado}
                </Typography>
                <Typography variant="body1">
                  CEP:
                  {endereco.cep}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                direction: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}
              >
                <Button
                  variant="contained"
                  sx={{ width: '100%', height: '50px' }}
                  onClick={() => navigate(`register/${endereco.id}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: '100%', height: '50px', backgroundColor: 'tomato' }}
                  onClick={() => handleDelete(endereco.id!)}
                >
                  Excluir
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box>
            <Typography variant="body1">Endereço não encontrado</Typography>
            <Button variant="contained" onClick={() => handleRegisterClick()}>
              Cadastrar endereço
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MeuEndereco;
