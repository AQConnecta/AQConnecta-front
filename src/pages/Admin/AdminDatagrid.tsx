import { Box, styled, alpha } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useEffect } from 'react';
import RenderActions from './components/RenderActions';
import DeleteHandler from './DeleteHandler';
import useVaga from '../../hooks/useVaga';
import VagaModal from '../Home/components/VagaModal';
import useUniversidade from '../../hooks/useUniversidade';
import UniversidadeModal from './components/UniversidadeModal';
import useCompetencia from '../../hooks/useCompetencia';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY
            + theme.palette.action.selectedOpacity
            + theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const vagaColumns = [
  { field: 'id', headerName: 'ID' },
  { field: 'publicador', headerName: 'Publicador' },
  { field: 'titulo', headerName: 'Título' },
  { field: 'descricao', headerName: 'Descrição' },
  { field: 'localDaVaga', headerName: 'Local' },
  { field: 'aceitaRemoto', headerName: 'Remoto' },
  { field: 'dataLimiteCandidatura', headerName: 'Data limite' },
  { field: 'criadoEm', headerName: 'Criado em' },
  { field: 'atualizadoEm', headerName: 'Atualizado em' },
  { field: 'iniciante', headerName: 'Iniciante' },
  { field: 'competencias', headerName: 'Competências' },
];

const universidadeColumns = [
  { field: 'id', headerName: 'ID' },
  { field: 'codigoIes', headerName: 'Código IES', width: 85 },
  { field: 'nomeInstituicao', headerName: 'Nome da Instituição', width: 300 },
  { field: 'sigla', headerName: 'Sigla', width: 80 },
  { field: 'categoriaIes', headerName: 'Categoria IES' },
  { field: 'organizacaoAcademica', headerName: 'Organização Acadêmica' },
  { field: 'codigoMunicipioIbge', headerName: 'Código Município IBGE' },
  { field: 'municipio', headerName: 'Município' },
  { field: 'uf', headerName: 'UF', width: 40 },
  { field: 'situacaoIes', headerName: 'Situação IES' },
];

const competenciaColumns = [
  { field: 'id', headerName: 'ID', minWidth: 400, flex: 1 },
  { field: 'descricao', headerName: 'Descrição', minWidth: 400, flex: 3 },
];

type AdminDatagridProps = {
  type: 'vaga' | 'universidade' | 'competencia';
};

function AdminDatagrid({ type }: AdminDatagridProps) {
  const { vagas, reloadVagas, isLoading: vagaLoading } = useVaga();
  const { universidades, reloadUniversidades, isLoading: universidadeLoading } = useUniversidade();
  const { competencias, reloadCompetencias, isLoading: competenciaLoading } = useCompetencia();

  const objRowsMapper = {
    vaga: vagas,
    universidade: universidades,
    competencia: competencias,
  }

  const objColumnsMapper = {
    vaga: vagaColumns,
    universidade: universidadeColumns,
    competencia: competenciaColumns,
  }

  const isLoading = vagaLoading || universidadeLoading || competenciaLoading;

  const handleVagaDeleteRow = (id) => {
    DeleteHandler({ reload: reloadVagas, type: 'vaga', id });
  }

  const handleUniversidadeDeleteRow = (id) => {
    DeleteHandler({ reload: reloadUniversidades, type: 'universidade', id });
  }

  const handleCompetenciaDeleteRow = (id) => {
    DeleteHandler({ reload: reloadCompetencias, type: 'competencia', id });
  }

  useEffect(() => {
    vagaColumns.push({ field: 'action', headerName: '', sortable: false, minWidth: 150, flex: 1, renderCell: (params) => <RenderActions params={params} handleDeleteRow={handleVagaDeleteRow} EditModal={VagaModal} noEdit /> })
    universidadeColumns.push({ field: 'action', headerName: '', sortable: false, minWidth: 150, flex: 1, renderCell: (params) => <RenderActions params={params} handleDeleteRow={handleUniversidadeDeleteRow} EditModal={UniversidadeModal} update={() => reloadUniversidades()} /> })
    competenciaColumns.push({ field: 'action', headerName: '', sortable: false, minWidth: 150, flex: 1, renderCell: (params) => <RenderActions params={params} handleDeleteRow={handleCompetenciaDeleteRow} noEdit /> })
  }, [])

  return (
    <Box sx={{ height: '70vh' }}>
      {!isLoading && (
        <StripedDataGrid
          columnVisibilityModel={{
            id: type === 'competencia',
          }}
          initialState={{ pinnedColumns: { right: ['actions'] } }}
          rows={objRowsMapper[type]}
          columns={objColumnsMapper[type]}
          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        />
      )}
    </Box>
  );
}

export default AdminDatagrid;
