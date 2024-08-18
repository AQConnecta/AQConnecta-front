import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, IconButton, Menu, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import VagaModal from '../Home/components/VagaModal';
import { Link } from '@mui/material';
import { Usuario } from '../../services/endpoints/auth';

function MinhasVagas() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const [isOpenEditVaga, setIsOpenEditVaga] = useState(false);
  const [vagaToEdit, setVagaToEdit] = useState<Vaga | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [candidatos, setCandidatos] = useState<Array<{ usuario: Usuario, curriculoUrl: string }> | null>(null);
  const { user } = useAuth();
  const open = Boolean(anchorEl);

  function reloadVagas() {
    // Função para recarregar as vagas
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setSelectedVaga(null);
    setCandidatos(null);
  };

  async function handleEdit(vaga: Vaga) {
    setIsOpenEditVaga(true);
    setVagaToEdit(vaga);
    handleClose();
  }

  async function handleDelete(vaga: Vaga) {
    try {
      await api.vaga.deletarVaga(vaga.id);
      reloadVagas();
      enqueueSnackbar('Vaga excluída com sucesso', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Erro ao excluir a vaga', { variant: 'error' });
    }
  }

  async function handleCardClick(vaga: Vaga) {
    try {
      const res = await api.vaga.listarCandidatos(vaga.id);
      setCandidatos(res.data.data);
      setSelectedVaga(vaga);
    } catch (err) {
      enqueueSnackbar('Erro ao buscar candidatos', { variant: 'error' });
    }
  }

  function handleCloseEditModal() {
    reloadVagas();
    setIsOpenEditVaga(false);
  }

  useEffect(() => {
    async function getMinhasVagas() {
      try {
        const res = await api.vaga.listByUser(user.id);
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as suas vagas', { variant: 'error' });
      }
    }

    getMinhasVagas();
  }, [user]);

  return (
    <Box sx={{ maxWidth: '608px', width: '100%', padding: '0px 16px' }}>
      {isOpenEditVaga && (
        <VagaModal isOpen={isOpenEditVaga} handleClose={() => handleCloseEditModal()} vagaToEdit={vagaToEdit} />
      )}
      {vagas.length ? vagas.map((vaga) => (
        <Card sx={{ borderBottom: '1px solid #00000014', padding: '0px 24px', width: '560px', backgroundColor: 'white' }} key={vaga.id}>
          <Box onClick={() => handleCardClick(vaga)} sx={{ cursor: 'pointer' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0px 16px 0px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>{vaga.titulo}</Typography>
                <IconButton onClick={handleClick} onMouseEnter={(e) => e.stopPropagation()}>
                  <MoreVertOutlinedIcon sx={{ height: '24px', width: '24px' }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  <MenuItem onClick={() => handleEdit(vaga)} sx={{ display: 'flex', gap: '8px' }}>
                    <EditOutlinedIcon />
                    {' '}
                    Editar
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(vaga)} sx={{ display: 'flex', gap: '8px' }}>
                    <DeleteOutlineOutlinedIcon />
                    {' '}
                    Excluir
                  </MenuItem>
                </Menu>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic' }}>
                  Criado por {vaga.publicador.nome}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 400 }}>
                    {vaga.localDaVaga}
                  </Typography>
                </Box>
                <Chip label={vaga.aceitaRemoto ? 'Vaga remota' : 'Vaga presencial'} sx={{ backgroundColor: '#dad5fc', height: '24px', width: '118px' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Sobre a vaga:</Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{vaga.descricao}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Competências:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                  {vaga.competencias.map((competencia) => (
                    <Chip label={competencia.descricao} sx={{ backgroundColor: '#dad5fc', height: '24px' }} key={competencia.id} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      )) : (
        <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Nenhuma vaga encontrada</h1>
        </Card>
      )}

      {selectedVaga && (
        <Dialog open={!!selectedVaga} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>Candidatos para {selectedVaga.titulo}</DialogTitle>
          <DialogContent>
            {candidatos?.length ? (
              candidatos.map((candidato, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <Avatar src={candidato.usuario.fotoPerfil} alt={candidato.usuario.nome} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography>{candidato.usuario.nome}</Typography>
                    {candidato.curriculoUrl && (
                      <Link href={candidato.curriculoUrl} target="_blank" rel="noopener noreferrer">
                        Ver currículo
                      </Link>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>Nenhum candidato encontrado</Typography>
            )}
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                  Fechar
              </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default MinhasVagas;
