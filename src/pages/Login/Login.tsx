import { Box, Button, Input, InputLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, redirect } from 'react-router-dom'
import api from '../../services/api';
import { useSnackbar } from 'notistack';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validFields, setValidFields] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    async function handleLogin() {
        try {
            const user = await api.auth.login({email, senha: password})
            if(user) {
                localStorage.setItem('token', user.token)
                localStorage.setItem('user', JSON.stringify(user))
                redirect('/home')
            }
        } catch (err) {
            console.log(err)
            enqueueSnackbar('Usuário ou senha inválidos', {variant: 'error'})
        }
    }

    useEffect(() => {
        setValidFields(email.length > 0 && password.length > 0)
    }, [email, password])

    return (
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'10px', height:'100vh'}}>
            <Box sx={{display:'flex', alignItems:'center', flexDirection:'column', gap:'15px', width: '100%', boxShadow: '0 1px 2px #0003', backgroundColor: 'white', maxWidth: '350px', padding: '20px', borderRadius:'5px'}}>
                <Box sx={{fontSize: '23px', fontWeight: 600, color: '#676767', marginBottom: '15px'}}>Login</Box>
                <TextField variant='outlined' placeholder='Digite seu E-mail' label='E-mail' onChange={(e) => setEmail(e.target.value)} sx={{width: '100%'}} />
                <TextField variant='outlined' type="password" placeholder='Senha' label='Senha' onChange={(e) => setPassword(e.target.value)} sx={{width: '100%'}}/>
                <Box sx={{alignSelf: 'flex-end'}}><Link to='/forgot-password'>Esqueci minha senha</Link></Box>
                <Button variant='contained' onClick={() => handleLogin()} sx={{width: '100%', height:'50px'}} disabled={!validFields}>Entrar</Button>
                <p>Não tem conta? <Link to="/register"><Box sx={{textDecoration: 'none', color: '#676767'}}>Registre-se</Box></Link></p>
            </Box>
        </Box>
    );
    }

export default Login;