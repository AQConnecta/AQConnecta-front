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
  useMediaQuery,
  Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useTheme } from '@mui/material/styles'
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
      width: 360,
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
  const [vaga, setVaga] = useState<Vaga>(editObj || (vagaDefaultValues as Vaga))
  const [competenciasList, setCompetenciasList] = useState<Competencia[]>([])
  const [competencias, setCompetencias] = useState(editObj?.competencias || [])
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0)
  const { enqueueSnackbar } = useSnackbar()
  const isEdit = !!editObj

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        const vagaResponse = await api.vaga.alterarVaga(editObj?.id!, {
          ...vaga,
          atualizadoEm: new Date().toISOString(),
          dataLimiteCandidatura: `${vaga.dataLimiteCandidatura}T00:00:00`,
        })
        await api.competencia.linkCompetenciaVaga({ competencias, idVaga: vagaResponse.data.data.id })
        enqueueSnackbar('Vaga editada com sucesso', { variant: 'success' })
        onClose()
        return
      }
      const vagaResponse = await api.vaga.cadastrarVaga({
        ...vaga,
        atualizadoEm: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
        dataLimiteCandidatura: `${vaga.dataLimiteCandidatura}T00:00:00`,
      })
      const vagaId = vagaResponse.data.data.id
      await api.competencia.linkCompetenciaVaga({ competencias, idVaga: vagaId })
      enqueueSnackbar('Vaga criada com sucesso', { variant: 'success' })
      onClose()
    } catch {
      enqueueSnackbar('Erro ao criar vaga', { variant: 'error' })
    }
  }

  useEffect(() => {
    async function loadCompetencias() {
      try {
        const competenciasListRaw = await api.competencia.listAll(search, 0, 100)
        setCompetenciasList(competenciasListRaw.data.data.content)
      } catch {
        enqueueSnackbar('Erro ao carregar competências', { variant: 'error' })
        setReload((prev) => prev + 1)
      }
    }
    loadCompetencias()
  }, [search, reload, enqueueSnackbar])

  const handleChange = (event: SelectChangeEvent<typeof competencias>) => {
    const { value } = event.target
    setCompetencias(typeof value === 'string' ? (value.split(',') as unknown as Competencia[]) : (value as Competencia[]))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 1,
          }}
        >
          {isEdit ? 'Editar vaga' : 'Nova vaga'}
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 900 }}>
          {/* Linha título/cidade responsiva */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                placeholder="Título da vaga"
                label="Título"
                value={vaga.titulo}
                onChange={(e) => setVagaValue(e.target.value, 'titulo')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                placeholder="Cidade da vaga"
                label="Cidade"
                value={vaga.localDaVaga}
                onChange={(e) => setVagaValue(e.target.value, 'localDaVaga')}
                fullWidth
              />
            </Grid>
          </Grid>

          <TextField
            multiline
            rows={3}
            variant="outlined"
            placeholder="Descrição da vaga"
            label="Descrição"
            value={vaga.descricao}
            onChange={(e) => setVagaValue(e.target.value, 'descricao')}
            fullWidth
          />

          {/* Data + switches em grid */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                type="date"
                placeholder="Data limite para candidatura"
                label="Data limite"
                InputLabelProps={{ shrink: true }}
                value={vaga.dataLimiteCandidatura || ''}
                onChange={(e) => setVagaValue(e.target.value, 'dataLimiteCandidatura')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 4, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    checked={vaga.aceitaRemoto}
                    onChange={() => setVagaValue(!vaga.aceitaRemoto, 'aceitaRemoto')}
                  />
                  <Typography>Aceita remoto</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    checked={vaga.iniciante}
                    onChange={() => setVagaValue(!vaga.iniciante, 'iniciante')}
                  />
                  <Typography>Vaga para iniciantes</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Competências */}
          <FormControl fullWidth>
            <TextField
              label="Digite para filtrar as competências"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              sx={{ mb: 1 }}
              fullWidth
            />
            <Select
              id="competencias-multiple-chip"
              label="Competências relacionadas"
              value={competencias}
              multiple
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value: any) => (
                    <Chip key={value.id ?? value.descricao} label={value.descricao} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              fullWidth
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

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12} sm="auto">
            <Button onClick={onClose} color="primary" variant="outlined" fullWidth>
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button onClick={handleSubmit} color="primary" variant="contained" fullWidth>
              {isEdit ? 'Editar' : 'Criar'}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default VagaModal
