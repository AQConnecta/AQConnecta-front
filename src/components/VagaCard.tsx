import { Avatar, Box, Button, Card, Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import FmdGoodOutlined from '@mui/icons-material/FmdGoodOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import { Vaga } from '../services/endpoints/vaga';
import api from '../services/api';
import VagaModal from '../pages/Home/components/VagaModal';
import CandidatosModal from './CandidatosModal';
import SelecionarCurriculo from '../pages/Home/components/SelecionarCurriculo';

type VagaProps = {
    vaga: Vaga;
    reloadVagas: () => void;
    hideButton?: boolean;
}

function VagaCard(props: VagaProps) {
  const { vaga, reloadVagas, hideButton } = props;
  const [isOpenEditVaga, setIsOpenEditVaga] = useState(false);
  const [isOpenCandidatos, setIsOpenCandidatos] = useState(false);
  const [vagaToEdit, setVagaToEdit] = useState<Vaga | null>(null);
  const [isCurriculoModalOpen, setIsCurriculoModalOpen] = useState(false);
  const [vagaToApply, setVagaToApply] = useState<Vaga | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const enqueueSnackbar = useSnackbar()
  const { user } = useAuth();
  const createdByMe = vaga.publicador.id === user.id;
  const open = Boolean(anchorEl);
  const isExpired = new Date(vaga.dataLimiteCandidatura) < new Date();

  function handleOpenCurriculoModal(vagaSelected: Vaga) {
    setVagaToApply(vagaSelected);
    setIsCurriculoModalOpen(true);
  }

  function handleOpenCandidatos(vagaSelected: Vaga) {
    setSelectedVaga(vagaSelected);
    setIsOpenCandidatos(true);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleEdit(vagaSelected: Vaga) {
    setIsOpenEditVaga(true);
    setVagaToEdit(vagaSelected);
    handleClose();
  }

  async function handleSelectCurriculo(curriculoId: string) {
    if (vagaToApply) {
      try {
        await api.vaga.candidatarVaga(vagaToApply.id, curriculoId);
        enqueueSnackbar('Candidatura realizada com sucesso', { variant: 'success' });
        setIsCurriculoModalOpen(false);
      } catch (err) {
        enqueueSnackbar('Erro ao se candidatar', { variant: 'error' });
      }
    }
  }
  async function handleDelete(vagaSelected: Vaga) {
    try {
      await api.vaga.deletarVaga(vagaSelected.id);
      reloadVagas()
      enqueueSnackbar('Vaga excluída com sucesso', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Erro ao excluir a vaga', { variant: 'error' });
    }
  }

  function handleCloseEditModal() {
    reloadVagas();
    setIsOpenEditVaga(false);
  }

  return (
    <>
      { isOpenEditVaga && (
        <VagaModal isOpen={isOpenEditVaga} handleClose={() => handleCloseEditModal()} vagaToEdit={vagaToEdit} />
      )}
      { isOpenCandidatos && (
        <CandidatosModal isOpen={isOpenCandidatos} onClose={() => setIsOpenCandidatos(false)} selectedVaga={selectedVaga} />
      )}
      { isCurriculoModalOpen && (
        <SelecionarCurriculo
          isOpen={isCurriculoModalOpen}
          handleClose={() => setIsCurriculoModalOpen(false)}
          onSelect={handleSelectCurriculo}
        />
      )}
      <Card sx={{ borderBottom: '1px solid #00000014', padding: '0px 24px', width: '560px', backgroundColor: 'white' }} key={vaga.id}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0px 16px 0px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>{vaga.titulo}</Typography>
            {
              createdByMe
                  && (
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Avatar src={vaga.publicador.fotoPerfil} alt="Imagem de perfil" sx={{ height: '24px', width: '24px', borderRadius: '50%' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 400, fontStyle: 'italic' }}>
                Criado por
                {' '}
                {createdByMe ? 'você' : vaga.publicador.nome}
              </Typography>
            </Box>
            { isExpired && (
              <Chip label="Vaga expirada" sx={{ backgroundColor: 'tomato', height: '24px', width: '118px' }} />
            )}
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
                <Chip label={competencia.descricao} sx={{ backgroundColor: '#dad5fc', height: '24px' }} key={competencia.id} />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {createdByMe ? (
              <Button sx={{ fontStyle: 'italic', textDecoration: 'underline', fontSize: '12px', color: 'black', textTransform: 'initial' }} onClick={() => handleOpenCandidatos(vaga)}>
                Ver candidatos
              </Button>
            ) : (<Box />)}
            {!(hideButton || createdByMe) && (
              <Button variant="contained" color="primary" sx={{ height: '30px' }} onClick={() => handleOpenCurriculoModal(vaga)}>
                Quero me candidatar
              </Button>
            )}
          </Box>
        </Box>
      </Card>
    </>
  )
}

export default VagaCard;
