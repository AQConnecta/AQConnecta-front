import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { PartialVaga, Vaga } from '../../../services/endpoints/vaga'
import api from '../../../services/api'
import { Competencia } from '../../../services/endpoints/competencia'

type VagaModalProps = {
  isOpen: boolean
  handleClose: () => void
  editObj?: Vaga | null
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
}

const vagaDefaultValues: PartialVaga = {
  titulo: '',
  descricao: '',
  localDaVaga: '',
  aceitaRemoto: false,
  dataLimiteCandidatura: '',
  iniciante: false,
}

function VagaModal(props: VagaModalProps) {
  const { isOpen, handleClose, editObj } = props
  if (editObj) editObj.dataLimiteCandidatura = editObj.dataLimiteCandidatura.split('T')[0]
  const [vaga, setVaga] = useState<Vaga>(editObj || vagaDefaultValues as Vaga)
  const [competenciasList, setCompetenciasList] = useState<Competencia[]>([])
  const [competencias, setCompetencias] = useState(editObj?.competencias || [])
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0)
  const { enqueueSnackbar } = useSnackbar()
  const isEdit = !!editObj

  function setVagaValue(value: string | boolean, field: string) {
    setVaga({ ...vaga, [field]: value })
  }

  function clearFields() {
    setVaga(vagaDefaultValues as Vaga)
    setCompetencias([])
  }

  function onClose() {
    clearFields()
    handleClose()
  }

  async function handleSubmit() {
    try {
      if (isEdit) {
        const vagaResponse = await api.vaga.alterarVaga(editObj?.id!, { ...vaga, atualizadoEm: new Date().toISOString(), dataLimiteCandidatura: `${vaga.dataLimiteCandidatura}T00:00:00` })
        await api.competencia.linkCompetenciaVaga({ competencias, idVaga: vagaResponse.data.data.id })
        enqueueSnackbar('Vaga editada com sucesso', { variant: 'success' })
        onClose()
        return
      }
      const vagaResponse = await api.vaga.cadastrarVaga({ ...vaga, atualizadoEm: new Date().toISOString(), criadoEm: new Date().toISOString(), dataLimiteCandidatura: `${vaga.dataLimiteCandidatura}T00:00:00` })
      const vagaId = vagaResponse.data.data.id
      await api.competencia.linkCompetenciaVaga({ competencias, idVaga: vagaId })
      enqueueSnackbar('Vaga criada com sucesso', { variant: 'success' })
      onClose()
    } catch (error) {
      enqueueSnackbar('Erro ao criar vaga', { variant: 'error' })
    }
  }

  useEffect(() => {
    async function loadCompetencias() {
      try {
        const competenciasListRaw = await api.competencia.listAll(search, 0, 100)
        setCompetenciasList(competenciasListRaw.data.data)
      } catch (error) {
        enqueueSnackbar('Erro ao carregar competências', { variant: 'error' })
        setReload((prev) => prev + 1)
      }
    }
    loadCompetencias()
  }, [search, reload])

  const handleChange = (event: SelectChangeEvent<typeof competencias>) => {
    const {
      target: { value },
    } = event
    setCompetencias(typeof value === 'string' ? value.split(',') as unknown as Competencia[] : value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px', padding: '8px' }}>
          {isEdit ? 'Editar vaga' : 'Nova vaga'}
          <IconButton onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '32px',
            maxWidth: '600px',
            padding: '8px',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <TextField
              variant="outlined"
              placeholder="Título da vaga"
              label="Titulo"
              value={vaga.titulo}
              onChange={(e) => setVagaValue(e.target.value, 'titulo')}
              sx={{ width: '100%' }}
            />
            <TextField
              variant="outlined"
              placeholder="Cidade da vaga"
              label="Cidade"
              value={vaga.localDaVaga}
              onChange={(e) => setVagaValue(e.target.value, 'localDaVaga')}
              sx={{ width: '100%' }}
            />
          </Box>
          <TextField
            multiline
            rows={3}
            variant="outlined"
            placeholder="Descrição da vaga"
            label="Descrição"
            value={vaga.descricao}
            onChange={(e) => setVagaValue(e.target.value, 'descricao')}
            sx={{ width: '100%', height: '100px' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px', width: '100%' }}>
            <TextField
              variant="outlined"
              type="date"
              placeholder="Data limite para candidatura"
              label="Data limite"
              InputLabelProps={{ shrink: true }}
              value={vaga.dataLimiteCandidatura.toLocaleString() || ''}
              onChange={(e) => setVagaValue(e.target.value, 'dataLimiteCandidatura')}
              sx={{ width: '100%' }}
            />
            <Box
              sx={{
                display: 'flex',
                direction: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                paddingRight: '5px',
                paddingBottom: '8px',
              }}
            >
              <Box sx={{
                display: 'flex',
                direction: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
              >
                <Switch checked={vaga.aceitaRemoto} onChange={() => setVagaValue(!vaga.aceitaRemoto, 'aceitaRemoto')} />
                <Typography>Aceita remoto</Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                direction: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
              >
                <Switch checked={vaga.iniciante} onChange={() => setVagaValue(!vaga.iniciante, 'iniciante')} />
                <Typography>Vaga para iniciantes</Typography>
              </Box>
            </Box>
          </Box>

          <FormControl fullWidth>
            <TextField
              label="Digite para filtrar as competências"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              sx={{ marginBottom: '8px' }}
            />
            <Select
              id="demo-multiple-chip"
              label="Competências relacionadas"
              value={competencias}
              multiple
              onChange={handleChange}
              sx={{ width: '100%' }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip label={value.descricao} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {competenciasList.map((competencia) => (
                <MenuItem key={competencia.id} value={competencia as unknown as string}>
                  {competencia.descricao}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '32px', width: '100%', padding: '0px 24px 16px 24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: '16px' }}>
            <Button onClick={() => onClose()} color="primary" variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={() => handleSubmit()}
              color="primary"
              variant="contained"
            >
              {isEdit ? 'Editar' : 'Criar'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default VagaModal
