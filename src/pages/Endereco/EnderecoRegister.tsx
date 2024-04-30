import {
  Box, Button, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Endereco } from '../../services/endpoints/endereco';
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';

function EnderecoRegister() {
  const [endereco, setEndereco] = useState<Endereco>({
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    numeroCasa: '',
    complemento: '',
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id: enderecoId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEdit = !!enderecoId;

  async function submitEndereco() {
    if (isEdit) {
      try {
        await api.endereco.alterarEndereco(endereco.id!, endereco);
        enqueueSnackbar('Endereço editado com sucesso', {
          variant: 'success',
        });
        navigate('/endereco');
      } catch (error) {
        enqueueSnackbar('Erro ao editar endereço', { variant: 'error' });
      }
      return;
    }
    try {
      await api.endereco.cadastrarEndereco(endereco);
      enqueueSnackbar('Endereço cadastrado com sucesso', {
        variant: 'success',
      });
      navigate('/endereco');
    } catch (error) {
      enqueueSnackbar('Erro ao cadastrar endereço', { variant: 'error' });
    }
  }

  useEffect(() => {
    if (!enderecoId || !user) return;
    async function getEndereco() {
      try {
        const res = await api.endereco.getEndereco(user.id);
        setEndereco(res.data.data[0]);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar endereço', { variant: 'error' });
      }
    }
    getEndereco();
  }, [enderecoId]);

  const handleKeyPress = useHandleKeyPress({
    verification: Object.values(endereco).every((value) => value.length > 0),
    key: 'Enter',
    callback: () => submitEndereco(),
  });

  function setEnderecoValue(value: string, field: string) {
    setEndereco({ ...endereco, [field]: value });
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

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
        <Typography variant="h6">
          {isEdit ? 'Editar' : 'Cadastrar'}
          {' '}
          endereço
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Digite seu CEP"
          label="CEP"
          value={endereco.cep}
          onChange={(e) => setEnderecoValue(e.target.value, 'cep')}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite o estado"
          label="Estado"
          value={endereco.estado}
          onChange={(e) => setEnderecoValue(e.target.value, 'estado')}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite a cidade"
          label="Cidade"
          value={endereco.cidade}
          onChange={(e) => setEnderecoValue(e.target.value, 'cidade')}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite o bairro"
          label="Bairro"
          value={endereco.bairro}
          onChange={(e) => setEnderecoValue(e.target.value, 'bairro')}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite sua rua"
          label="Rua"
          value={endereco.rua}
          onChange={(e) => setEnderecoValue(e.target.value, 'rua')}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite o número"
          label="Número"
          value={endereco.numeroCasa}
          onChange={(e) => setEnderecoValue(e.target.value, 'numeroCasa')}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite o complemento"
          label="Complemento"
          value={endereco.complemento}
          onChange={(e) => setEnderecoValue(e.target.value, 'complemento')}
          sx={{ width: '100%' }}
        />

        <Button
          variant="contained"
          sx={{ width: '100%', height: '50px' }}
          disabled={!Object.values(endereco).every((value) => value.length > 0)}
          onClick={() => submitEndereco()}
        >
          {isEdit ? 'Salvar' : 'Cadastrar'}
        </Button>
      </Box>
    </Box>
  );
}

export default EnderecoRegister;
