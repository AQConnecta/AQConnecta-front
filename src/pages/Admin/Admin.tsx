import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import AdminDatagrid from './AdminDatagrid'
import UniversidadeModal from './components/UniversidadeModal'
import CompetenciaModal from './components/CompetenciaModal'

type ObjTypes = 'vaga' | 'universidade' | 'competencia'

function Admin() {
  const [type, setType] = useState<ObjTypes>('vaga')
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenCompetencia, setIsOpenCompetencia] = useState(false)

  function getBorderStyle(objType: ObjTypes) {
    if (type === objType) {
      return 'solid solid hidden solid'
    }
    return 'solid'
  }

  function getBorderColor(objType: ObjTypes) {
    if (type === objType) {
      return '1px solid #5E63B6'
    }
    return '1px solid rgba(224, 224, 224, 1)'
  }

  function getBackgroundColor(objType: ObjTypes) {
    if (type === objType) {
      return 'white'
    }
    return 'transparent'
  }

  return (
    <Box sx={{ height: '60vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: '-8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', gap: '-8px' }}>
          <Box
            onClick={() => setType('vaga')}
            sx={{
              width: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: getBorderColor('vaga'),
              borderStyle: getBorderStyle('vaga'),
              backgroundColor: getBackgroundColor('vaga'),
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <Typography>Vagas</Typography>
          </Box>
          <Box
            onClick={() => setType('universidade')}
            sx={{
              width: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: getBorderColor('universidade'),
              borderStyle: getBorderStyle('universidade'),
              backgroundColor: getBackgroundColor('universidade'),
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <Typography>Universidades</Typography>
          </Box>
          <Box
            onClick={() => setType('competencia')}
            sx={{
              width: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: getBorderColor('competencia'),
              borderStyle: getBorderStyle('competencia'),
              backgroundColor: getBackgroundColor('competencia'),
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <Typography>Competências</Typography>
          </Box>
        </Box>
        {type === 'universidade' && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsOpen(true)}
            >
              Criar universidade
            </Button>
          </Box>
        )}
        {type === 'competencia' && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsOpenCompetencia(true)}
            >
              Criar competência
            </Button>
          </Box>
        )}
      </Box>
      <AdminDatagrid type={type} />
      <UniversidadeModal isOpen={isOpen} handleClose={() => setIsOpen(false)} />
      <CompetenciaModal isOpen={isOpenCompetencia} handleClose={() => setIsOpenCompetencia(false)} />
    </Box>
  )
}

export default Admin
