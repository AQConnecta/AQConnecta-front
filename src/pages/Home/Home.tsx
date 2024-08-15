import { Box, Button, Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import FmdGoodOutlined from '@mui/icons-material/FmdGoodOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Card from '../../components/Card';
import { Vaga } from '../../services/endpoints/vaga';
import api from '../../services/api';
import CreateVaga from './components/CreateVaga';
import { useAuth } from '../../contexts/AuthContext';
import VagaModal from './components/VagaModal';

function Home() {
  const [vagas, setVagas] = useState<Array<Vaga>>([]);
  const [isOpenEditVaga, setIsOpenEditVaga] = useState(false);
  const [vagaToEdit, setVagaToEdit] = useState<Vaga | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [shouldReload, setShouldReload] = useState(0);
  const { user } = useAuth();
  const open = Boolean(anchorEl);

  function reloadVagas() {
    setShouldReload((prev) => prev + 1);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleEdit(vaga: Vaga) {
    setIsOpenEditVaga(true);
    setVagaToEdit(vaga);
    handleClose();
  }

  async function handleDelete(vaga: Vaga) {
    try {
      await api.vaga.deletarVaga(vaga.id);
      reloadVagas()
      enqueueSnackbar('Vaga excluída com sucesso', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Erro ao excluir a vaga', { variant: 'error' });
    }
  }

  function handleCloseEditModal() {
    setIsOpenEditVaga(false);
  }

  async function handleApply() {
    try {
      // await api.vaga.candidatarVaga(vaga.id);
      enqueueSnackbar('Candidatura realizada com sucesso', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Erro ao se candidatar', { variant: 'error' });
    }
  }

  useEffect(() => {
    async function getVagas() {
      try {
        const res = await api.vaga.listAll();
        if (res.data.data.length === 0) {
          return;
        }
        setVagas(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar as competencias mais usadas', { variant: 'error' });
      }
    }

    getVagas();
  }, [shouldReload]);

  return (
    <Box sx={{ maxWidth: '608px', width: '100%', padding: '0px 16px' }}>
      <CreateVaga sx={{ width: '592px' }} />
      { isOpenEditVaga && (
        <VagaModal isOpen={isOpenEditVaga} handleClose={() => handleCloseEditModal()} vagaToEdit={vagaToEdit} />
      )}
      {vagas.length ? vagas.map((vaga) => {
        return (
          <Card sx={{ borderBottom: '1px solid #00000014', padding: '0px 24px', width: '560px', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0px 16px 0px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>{vaga.titulo}</Typography>
                {
                // vaga.publicador.id === user?.id &&
                  true && (
                    <>
                      <IconButton onClick={handleClick}>
                        <MoreVertOutlinedIcon sx={{ height: '24px', width: '24px' }} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
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
                    </>
                  )
                }
              </Box>
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic' }}>
                  Criado por
                  {/* {vaga.publicador.nome} */}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <FmdGoodOutlined sx={{ height: '14px', width: '14px' }} />
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
                    <Chip label={competencia.descricao} sx={{ backgroundColor: '#dad5fc', height: '24px' }} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" sx={{ height: '30px' }} onClick={() => handleApply()}>Quero me candidatar</Button>
                {' '}
                {/* VERIFICAR SE JÁ ME CANDIDATEI A VAGA */}
                {/* <Button variant="contained" disabled={vaga.publicador.id === user?.id} color="primary" sx={{ height: '30px' }} onClick={() => handleApply()}>Quero me candidatar</Button> */}
              </Box>
            </Box>
          </Card>
        );
      })
        : (
          <Card sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1>Nenhuma vaga encontrada</h1>
          </Card>
        )}
    </Box>
  );
}

export default Home;
