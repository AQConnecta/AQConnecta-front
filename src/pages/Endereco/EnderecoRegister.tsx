/* eslint-disable no-unused-vars */
import { Box, Button, TextField, Typography, IconButton, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close'
import { Endereco } from '../../services/endpoints/endereco'
import useHandleKeyPress from '../../hooks/useHandleKeyPress'
import api from '../../services/api'

interface IModal {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  enderecoEdit: Endereco
}

function EnderecoRegister({ isOpen, setOpen, enderecoEdit }: IModal) {
  const [endereco, setEndereco] = useState<Endereco>(enderecoEdit || {
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    numeroCasa: '',
    complemento: '',
  })
  const { enqueueSnackbar } = useSnackbar()
  const isEdit = !!enderecoEdit

  async function submitEndereco() {
    if (isEdit) {
      try {
        await api.endereco.alterarEndereco(endereco.id!, endereco)
        enqueueSnackbar('Endereço editado com sucesso', {
          variant: 'success',
        })
      } catch (error) {
        enqueueSnackbar('Erro ao editar endereço', { variant: 'error' })
      }
      return
    }
    try {
      await api.endereco.cadastrarEndereco(endereco)
      enqueueSnackbar('Endereço adicionado com sucesso', {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar('Erro ao adicionar endereço', { variant: 'error' })
    }
  }

  const handleKeyPress = useHandleKeyPress({
    verification: Object.values(endereco).every((value) => value.length > 0),
    key: 'Enter',
    callback: () => submitEndereco(),
  })

  function setEnderecoValue(value: string, field: string) {
    setEndereco({ ...endereco, [field]: value })
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {isEdit ? 'Editar' : 'Adicionar'}
            {' '}
            endereço
          </Typography>
          <IconButton onClick={() => setOpen(!isOpen)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '340px', display: 'flex', gap: '8px', flexDirection: 'column', paddingTop: '8px' }}>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ padding: '0px 16px 8px 0px' }}>
          <Button
            variant="contained"
            disabled={!Object.values(endereco).every((value) => value.length > 0)}
            onClick={() => submitEndereco()}
          >
            {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default EnderecoRegister
