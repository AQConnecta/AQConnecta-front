import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { Endereco } from '../../services/endpoints/endereco'
import { useAuth } from '../../contexts/AuthContext'
import { FaTrash, FaPencil  } from "react-icons/fa6";
import { colors } from '../../styles/colors'

function MeuEndereco() {
  const { user } = useAuth()
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [shouldReload, setShouldReload] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    async function getEndereco() {
      try {
        const res = await api.endereco.getEndereco(user.id)
        setEnderecos(res.data.data)
      } catch (err) {
        enqueueSnackbar('Erro ao buscar endereço', { variant: 'error' })
      }
    }

    getEndereco()
  }, [shouldReload])

  function reload() {
    setShouldReload((prev) => prev + 1)
  }

  function handleRegisterClick() {
    navigate('register')
  }

  async function handleDelete(idEndereco: string) {
    try {
      await api.endereco.deletarEndereco(idEndereco)
      enqueueSnackbar('Endereço deletada com sucesso', { variant: 'success' })
      reload()
    } catch (err) {
      enqueueSnackbar('Erro ao deletar endereço', { variant: 'error' })
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
          backgroundColor: colors.background,
          maxWidth: '350px',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        <Button variant="contained" sx={{marginBottom: '20px'}} onClick={() => navigate('register')}>
          Cadastrar endereço
        </Button>

        {enderecos && enderecos.length > 0 ? (
          enderecos.map((endereco: Endereco, index: number) => (
            <Box key={index} sx={{ padding: '15px', border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#fff', color: '#000'}}>
              <Typography variant="h6" fontWeight="bold">
                Endereço {index + 1}
              </Typography>
              <Box sx={{ padding: '8px' }}>
                <Typography variant="body1" display="inline" fontWeight="bold">
                  Rua: {''}
                </Typography>
                {endereco.rua} <br />
                <Typography variant="body1" display="inline" fontWeight="bold">
                  Número: {' '}
                </Typography>
                {endereco.numeroCasa} <br />
                <Typography variant="body1" display="inline" fontWeight="bold">
                  Bairro: {' '}
                </Typography>
                {endereco.bairro} <br />
                <Typography variant="body1" display="inline" fontWeight="bold">
                  Cidade: {' '}
                </Typography>
                {endereco.cidade} <br />
                <Typography variant="body1" display="inline" fontWeight="bold">
                  Estado: {' '}
                </Typography>
                {endereco.estado} <br />
                <Typography variant="body1" display="inline" fontWeight="bold">
                  CEP: {' '}
                </Typography>
                {endereco.cep} <br />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  direction: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                {/*<Button variant="contained" sx={{ width: '100%', height: '50px',  display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => navigate(`register/${endereco.id}`)}>*/}
                <Button variant="contained" sx={{ width: '100%', height: '50px',  display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', color: '#000', border: '1px solid white',  '&:hover':{backgroundColor: '#fff', border: '1px solid green', color: 'green'}}} onClick={() => navigate(`register/${endereco.id}`)}>
                <Typography>  
                     Editar
                  </Typography>
                  <FaPencil />
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: '100%', height: '50px',  display: 'flex', alignItems: 'center', justifyContent: 'space-between',  backgroundColor: '#fff', color: '#000', border: '1px solid white',  '&:hover':{backgroundColor: '#fff', border: '1px solid red', color: 'red'}}}
                  onClick={() => handleDelete(endereco.id!)}
                >
                  <Typography>  
                    Excluir
                </Typography>
                  <FaTrash />
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography variant="body1">Endereço não encontrado</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MeuEndereco
