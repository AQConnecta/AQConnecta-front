import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../styles/colors'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validFields, setValidFields] = useState(false)
  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  async function handleClickLogin() {
    const { logged, isAdmin } = await handleLogin(email, password)
    if (logged) {
      if (isAdmin) navigate('/admin')
      else navigate('/home')
    }
  }

  useEffect(() => {
    setValidFields(email.length > 0 && password.length > 0)
  }, [email, password])

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', height: '98vh', backgroundColor: colors.background,
    }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '15px', width: '100%', boxShadow: '0 1px 2px #0003', backgroundColor: 'white', maxWidth: '350px', padding: '20px', borderRadius: '5px',
      }}
      >
        <Box sx={{
          fontSize: '23px', fontWeight: 600, color: '#676767', marginBottom: '15px',
        }}
        >
          Login
        </Box>
        <TextField variant="outlined" placeholder="Digite seu E-mail" label="E-mail" onChange={(e) => setEmail(e.target.value)} sx={{ width: '100%' }} />
        <TextField variant="outlined" type="password" placeholder="Senha" label="Senha" onChange={(e) => setPassword(e.target.value)} sx={{ width: '100%' }} />
        <Box sx={{ alignSelf: 'flex-end' }}><Link to="/forgot-password">Esqueci minha senha</Link></Box>
        <Button variant="contained" onClick={() => handleClickLogin()} sx={{ width: '100%', height: '50px' }} disabled={!validFields}>Entrar</Button>
        <p>
          Não tem conta?
          <Link to="/register"><Box sx={{ textDecoration: 'none', color: '#676767' }}>Registre-se</Box></Link>
        </p>
      </Box>
    </Box>
  );
}

export default Login;
