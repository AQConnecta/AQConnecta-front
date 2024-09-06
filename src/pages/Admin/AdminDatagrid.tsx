import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from 'react';
import RenderActions from './components/RenderActions';
import DeleteHandler from './DeleteHandler';
import useVaga from '../../hooks/useVaga';
import VagaModal from '../Home/components/VagaModal';

// const userColumns = [
//   { field: 'id', headerName: 'ID' },
//   { field: 'nome', headerName: 'Nome' },
//   { field: 'email', headerName: 'E-mail' },
//   { field: 'action', headerName: '', sortable: false, width: 150, renderCell: (params) => <RenderActions params={params} handleDeleteRow={handleDeleteRow} EditModal={editUser} /> },
// ];

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

function AdminDatagrid() {
  const { vagas, reloadVagas, isLoading } = useVaga();

  const handleVagaDeleteRow = (id) => {
    DeleteHandler(reloadVagas, 'vaga', id);
  }

  useEffect(() => {
    vagaColumns.push({ field: 'action', headerName: '', sortable: false, width: 150, renderCell: (params) => <RenderActions params={params} handleDeleteRow={handleVagaDeleteRow} EditModal={VagaModal} /> })
  }, [])

  return (
    <Box sx={{ height: '300px' }}>
      {!isLoading && (
        <DataGrid
          columnVisibilityModel={{
            id: false,
          }}
          rows={vagas}
          columns={vagaColumns}
        />
      )}
    </Box>
  );
}

export default AdminDatagrid;
