import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { Vaga } from '../../../services/endpoints/vaga'

type VagaModalProps = {
  isOpen: boolean
  handleClose: () => void
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
}

function VagaModal(props: VagaModalProps) {
  const { isOpen, handleClose } = props
  const [vaga, setVaga] = useState<Vaga>({} as Vaga)
  const [competencias, setCompetencias] = useState<string[]>([])

  function setVagaValue(value: string, field: string) {
    setVaga({ ...vaga, [field]: value })
  }

  const handleChange = (event: SelectChangeEvent<typeof competencias>) => {
    const {
      target: { value },
    } = event
    setCompetencias(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <Dialog open={isOpen} onClose={() => handleClose()}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px', padding: '8px' }}>
          Nova vaga
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormControl>
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
                value={vaga.dataLimiteCandidatura || ''}
                onChange={(e) => setVagaValue(e.target.value, 'dataLimiteCandidatura')}
                sx={{ width: '100%' }}
              />
              <Box
                sx={{
                  display: 'flex',
                  direction: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                  paddingRight: '5px',
                  paddingBottom: '8px',
                }}
              >
                <Switch checked={vaga.aceitaRemoto} onChange={() => setVagaValue(!vaga.aceitaRemoto, 'aceitaRemoto')} />
                <Typography>Aceita remoto</Typography>
              </Box>
            </Box>

            <InputLabel htmlFor="demo-multiple-chip" id="demo-multiple-chip-label">Competências relacionadas</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              value={competencias}
              multiple
              onChange={handleChange}
              sx={{ width: '100%' }}
              label="Competências relacionadas"
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              <MenuItem value="CLT">CLT</MenuItem>
              <MenuItem value="PJ">PJ</MenuItem>
              <MenuItem value="Estágio">Estágio</MenuItem>
            </Select>
          </Box>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}

export default VagaModal
