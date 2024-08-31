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
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import { Competencia } from '../../services/endpoints/competencia';
import { Usuario } from '../../services/endpoints/auth';

type CompetenciaProps = {
  isOpen: boolean
  handleClose: () => void
  user: Usuario,
  onCompetenciasUpdated: () => void
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
}

function RelacionarUsuarioCompetencias(props: CompetenciaProps) {
  const { isOpen, handleClose, user, onCompetenciasUpdated } = props
  const [minhasCompetencias, setMinhasCompetencias] = useState<Competencia[]>([])
  const [competenciasList, setCompetenciasList] = useState(user?.competencias || [])
  const [search, setSearch] = useState('')
  const [reload, setReload] = useState(0)
  const { enqueueSnackbar } = useSnackbar()

  function onClose() {
    handleClose()
  }

  async function handleSubmit() {
    try {
      // I hate Typescript
      const competenciasEnviar = { 
        competencias: minhasCompetencias.map(competencia => ({ id: competencia.id }))
      }
      await api.competencia.linkCompetenciaToMe(competenciasEnviar)
      enqueueSnackbar('Competências vinculadas com sucesso', {
        variant: 'success',
      })
      onClose()
      onCompetenciasUpdated()
    } catch (error) {
      enqueueSnackbar('Erro ao relacionar competências', { variant: 'error' })
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


  const handleChange = (event: SelectChangeEvent<typeof minhasCompetencias>) => {
    const {
      target: { value },
    } = event
    setMinhasCompetencias(typeof value === 'string' ? value.split(',') as unknown as Competencia[] : value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px', padding: '8px' }}>
          {'Relacionar competências'}
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
            maxWidth: '500px',
            padding: '8px',
          }}
        >
          {/* Peço Perdão Davi, pela monstruosidade que criei aqui. */}
          <FormControl fullWidth>
            {/* <Label htmlFor="demo-multiple-chip" id="demo-multiple-chip-label">Competências relacionadas</Label> */}
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
              value={minhasCompetencias}
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
              {'Relacionar'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default RelacionarUsuarioCompetencias;
