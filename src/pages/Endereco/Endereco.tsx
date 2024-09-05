import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import { FaTrash, FaPencil } from 'react-icons/fa6';
import api from '../../services/api'
import { Endereco } from '../../services/endpoints/endereco'
import EnderecoRegister from './EnderecoRegister'
import { Usuario } from '../../services/endpoints/auth';
import Card from '../../components/Card';

type EnderecoProps ={
  user: Usuario
  isMe: boolean;
}

function MeuEndereco(props: EnderecoProps) {
  const { user, isMe } = props
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [enderecoEdit, setEnderecoEdit] = useState<Endereco | null>(null)
  const [shouldReload, setShouldReload] = useState(0)

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

  async function handleDelete(idEndereco: string) {
    try {
      await api.endereco.deletarEndereco(idEndereco)
      enqueueSnackbar('Endereço deletada com sucesso', { variant: 'success' })
      reload()
    } catch (err) {
      enqueueSnackbar('Erro ao deletar endereço', { variant: 'error' })
    }
  }

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Card sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Typography sx={{ fontSize: '20px', alignSelf: 'flex-start', padding: '8px', fontWeight: 600 }}>Endereços</Typography>
        <Box
          width="592px"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'white',
            maxWidth: '350px',
            padding: '20px',
            borderRadius: '5px',
          }}
        >

          {enderecos && enderecos.length > 0 ? (
            enderecos.map((endereco: Endereco, index: number) => (
              <Box key={index} sx={{ padding: '15px', border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: '#fff', color: '#000' }}>
                <Typography variant="h6" fontWeight="bold">
                  Endereço &nbsp;
                  {index + 1}
                </Typography>
                <Box sx={{ padding: '8px' }}>
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    Rua:&nbsp;
                  </Typography>
                  {endereco.rua}
                  <br />
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    Número:
                  </Typography>
                  {endereco.numeroCasa}
                  <br />
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    Bairro:
                  </Typography>
                  {endereco.bairro}
                  <br />
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    Cidade:
                  </Typography>
                  {endereco.cidade}
                  <br />
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    Estado:
                  </Typography>
                  {endereco.estado}
                  <br />
                  <Typography variant="body1" display="inline" fontWeight="bold">
                    CEP:
                  </Typography>
                  {endereco.cep}
                  <br />
                </Box>
                {isMe &&
                  <Box
                    sx={{
                      display: 'flex',
                      direction: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      onClick={() => {
                        setEnderecoEdit(endereco)
                        setOpen(!open)
                      }}
                    >
                      <FaPencil />
                      <Typography>
                        Editar
                      </Typography>
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ width: '100%', height: '50px', backgroundColor: 'tomato', display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:hover': { backgroundColor: 'red' } }}
                      onClick={() => handleDelete(endereco.id!)}
                    >
                      <FaTrash />
                      <Typography>
                        Excluir
                      </Typography>
                    </Button>
                  </Box>
                }
              </Box>
            ))
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1">Nenhum endereço encontrado</Typography>
            </Box>
          )}
        </Box>
        {isMe &&
          <>
            <Button variant="contained" sx={{ marginBottom: '20px' }} onClick={() => setOpen(!open)}>
              Adicionar endereço
            </Button>
            <EnderecoRegister isOpen={open} setOpen={setOpen} enderecoEdit={enderecoEdit!} />
          </>
        }
      </Box>
    </Card>
  )
}

export default MeuEndereco
