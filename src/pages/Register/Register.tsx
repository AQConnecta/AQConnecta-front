import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import api from '../../services/api';
import { RegisterBody } from '../../services/endpoints/auth';
import { useSnackbar } from 'notistack';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldsValid, setFieldsValid] = useState(false);
  const {enqueueSnackbar} = useSnackbar()
  const navigate = useNavigate()

  async function handleRegister() {
    try {
        const body: RegisterBody = { nome: name, email, senha: password }
        const res = await api.auth.register(body)
        enqueueSnackbar('Registrado com sucesso', {variant: 'success'})
        navigate('/login')
    } catch (err) {
        console.log(err)
        enqueueSnackbar('Erro ao registrar', {variant: 'error'})
    }
  }
  
  useEffect(() => {
    setFieldsValid(name.length > 0 && email.length > 0 && password.length > 0)
  }, [name, email, password])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '10px',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          boxShadow: '0 1px 2px #0003',
          backgroundColor: 'white',
          maxWidth: '350px',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        <Box
          sx={{
            fontSize: '23px',
            fontWeight: 600,
            color: '#676767',
            marginBottom: '15px',
          }}
        >
          Registre-se
        </Box>
        <TextField
          variant="outlined"
          placeholder="Digite seu nome"
          label="Nome"
          onChange={(e) => setName(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          placeholder="Digite seu E-mail"
          label="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          variant="outlined"
          type="password"
          placeholder="Senha"
          label="Senha"
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button
          variant="contained"
          onClick={() => handleRegister()}
          sx={{ width: '100%', height: '50px' }}
          disabled={!fieldsValid}
        >
          Registrar
        </Button>
        <p>
          Já tem conta?{' '}
          <Link to="/login">
            <Box sx={{ textDecoration: 'none', color: '#676767' }}>Entrar</Box>
          </Link>
        </p>
      </Box>
    </Box>
  );
}

export default Register;
