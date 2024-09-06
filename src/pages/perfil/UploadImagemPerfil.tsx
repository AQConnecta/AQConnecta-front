import React, { useState } from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import styled from 'styled-components';
import api from '../../services/api';
import Card from '../../components/Card';
import { Usuario } from '../../services/endpoints/auth';
import CustomDialog from '../../components/CustomDialog';

const Photo = styled.img<{isMe: boolean}>`
  box-shadow: none;
  width: 130px;
  height: 130px;
  object-fit: cover;
  border: 2px solid white;
  border-radius: 50%;
  cursor: ${({ isMe }) => (isMe ? 'pointer' : 'default')};
`

function UploadImagemPerfil() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      enqueueSnackbar('Por favor, selecione uma imagem para enviar.', { variant: 'warning' });
      return;
    }

    try {
      await api.perfil.uploadImagemPerfil(file);
      enqueueSnackbar('Imagem de perfil enviada com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao fazer upload da imagem. Tente novamente.', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Input
        type="file"
        onChange={handleFileChange}
        inputProps={{ accept: 'image/*' }}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={!file}
        onClick={handleUpload}
      >
        Enviar Imagem
      </Button>
    </Box>
  );
}

function Perfil({ user, isMe }: { user: Usuario, isMe: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Card sx={{ width: '100%' }}>
      {isMe
      && (
        <CustomDialog isOpen={isModalOpen} onClose={handleCloseModal} title="Upload de Imagem de Perfil">
          <UploadImagemPerfil />
        </CustomDialog>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'column', gap: '8px' }}>
        <Photo src={user.fotoPerfil || 'https://via.placeholder.com/72x72.png?text=No+Image'} onClick={handleOpenModal} isMe={isMe} />
        <Typography sx={{ fontWeight: 700 }}>
            &nbsp;
          {user.nome}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography sx={{ fontWeight: 500, display: 'flex', flexDirection: 'row' }}>
            <Typography sx={{ fontWeight: 700 }}>
              E-mail:&nbsp;
            </Typography>
            {user.email}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default Perfil;
