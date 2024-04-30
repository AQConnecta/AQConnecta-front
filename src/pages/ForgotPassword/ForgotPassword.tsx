import { Box, Button, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  async function handleForgotButtonPress() {
    try {
      await api.auth.forgotPassword({ email })
      enqueueSnackbar('E-mail enviado com sucesso', { variant: 'success' })
      navigate('/login')
    } catch (err) {
      enqueueSnackbar('Erro ao enviar e-mail', { variant: 'error' })
    }
  }

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
          Esqueci minha senha
        </Box>
        <Box>
          Digite abaixo o seu e-mail para recuperar a sua senha
        </Box>
        <TextField
          variant="outlined"
          placeholder="Digite seu E-mail"
          label="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button
          variant="contained"
          onClick={() => handleForgotButtonPress()}
          sx={{ width: '100%', height: '50px' }}
          disabled={!(email.length > 0)}
        >
          Recuperar senha
        </Button>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
