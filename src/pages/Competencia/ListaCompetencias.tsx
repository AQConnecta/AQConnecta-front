import { Box, Button, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridInputRowSelectionModel,
  GridRowId,
  GridRowSelectionModel,
} from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import api from '../../services/api'
import { Competencia } from '../../services/endpoints/competencia'
import { Usuario } from '../../services/endpoints/auth'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'descricao', headerName: 'Descrição' },
]

function ListCompetencia() {
  const [rows, setRows] = useState<Competencia[]>([])
  const [minhasCompetencias, setMinhasCompetencias] = useState<Competencia[]>([])
  const [shouldReload, setShouldReload] = useState(0)
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [selectedMyComp, setSelectedMyComp] = useState<GridRowSelectionModel>([])
  const user: Usuario = JSON.parse(localStorage.getItem('user') || '{}')

  function reload() {
    setShouldReload((prev) => prev + 1)
  }

  async function handleLinkWithMe() {
    try {
      const competencias: Array<{ id: string }> = []
      selectedRows?.forEach((comp: GridRowId) => {
        competencias.push({ id: `${comp}` })
      })
      await api.competencia.linkCompetenciaToMe({ competencias })
      enqueueSnackbar('Competências vinculadas com sucesso', {
        variant: 'success',
      })
      setSelectedRows([])
      reload()
    } catch (error) {
      enqueueSnackbar('Erro ao vincular competências', { variant: 'error' })
    }
  }

  async function handleUnlink() {
    try {
      const competencias: Array<{ id: string }> = []
      selectedMyComp.forEach((comp: GridRowId) => {
        competencias.push({ id: `${comp}` })
      })
      await api.competencia.removeCompetenciaFromMe({
        competencias,
      })
      enqueueSnackbar('Competências desvinculadas com sucesso', {
        variant: 'success',
      })
      setSelectedMyComp([])
      reload()
    } catch (error) {
      enqueueSnackbar('Erro ao desvincular competências', { variant: 'error' })
    }
  }

  useEffect(() => {
    async function getCompetencias() {
      try {
        const res = await api.competencia.listAll()
        setRows(res.data.data || [])
      } catch (error) {
        enqueueSnackbar('Erro ao buscar competências', { variant: 'error' })
      }
    }

    async function getMyCompetencias() {
      try {
        const res = await api.competencia.listByUserId(user.id)
        setMinhasCompetencias(res.data.data || [])
      } catch (error) {
        enqueueSnackbar('Erro ao buscar minhas competências', {
          variant: 'error',
        })
      }
    }

    getCompetencias()
    getMyCompetencias()
  }, [shouldReload])

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
        sx={{
          width: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '16px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            reload()
          }}
        >
          Atualizar
        </Button>
      </Box>
      <Box
        height="400px"
        width="800px"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: '64px',
        }}
      >
        <Box width="100%" height="100%">
          <Typography variant="h4">Lista de Competências</Typography>
          <DataGrid
            columnVisibilityModel={{
              id: false,
            }}
            rows={rows}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newselectedRows) => {
              setSelectedRows(newselectedRows)
            }}
            rowSelectionModel={selectedRows as GridInputRowSelectionModel}
            sx={{ maxHeight: '400px', height: '100%' }}
          />
          <Button variant="contained" color="primary" disabled={selectedRows.length === 0} onClick={() => handleLinkWithMe()}>
            Vincular a mim
          </Button>
        </Box>
        <Box width="100%" height="100%">
          <Typography variant="h4">Minhas Competências</Typography>
          <DataGrid
            columnVisibilityModel={{
              id: false,
            }}
            rows={minhasCompetencias}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newselectedRows) => {
              setSelectedMyComp(newselectedRows)
            }}
            rowSelectionModel={selectedMyComp}
            sx={{ maxHeight: '400px', height: '100%' }}
          />
          <Button variant="contained" color="primary" disabled={selectedMyComp.length === 0} onClick={() => handleUnlink()}>
            Desvincular a mim
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ListCompetencia
