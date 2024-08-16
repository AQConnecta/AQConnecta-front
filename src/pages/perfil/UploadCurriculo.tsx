import React, { useState } from 'react';
import { Box, Button, Typography, Input, Modal } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { PerfilEndpoint } from '../../services/endpoints/perfil';

function UploadCurriculo() {
  const [file, setFile] = useState<File | null>(null);
  const perfilEndpoint = new PerfilEndpoint();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      enqueueSnackbar('Por favor, selecione um currículo para enviar.', { variant: 'warning' });
      return;
    }

    try {
      const response = await perfilEndpoint.uploadCurriculo(file);
      enqueueSnackbar('Currículo enviado com sucesso!', { variant: 'success' });
      console.log(response.data);
    } catch (error) {
      console.error('Erro ao fazer upload do currículo:', error);
      enqueueSnackbar('Erro ao fazer upload do currículo. Tente novamente.', { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        maxWidth: '500px',
        margin: 'auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0a66c2', marginBottom: '16px' }}>
        Upload de Currículo
      </Typography>
      <Input
        type="file"
        onChange={handleFileChange}
        sx={{ marginBottom: '20px' }}
        inputProps={{ accept: '.pdf,.doc,.docx' }}  // Permite apenas arquivos de currículo
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#0a66c2',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          textTransform: 'none',
          '&:hover': { backgroundColor: '#004182' },
        }}
        onClick={handleUpload}
      >
        Enviar Currículo
      </Button>
    </Box>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: '100px' }}>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{
          backgroundColor: '#0a66c2',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          textTransform: 'none',
          '&:hover': { backgroundColor: '#004182' },
        }}
      >
        Abrir Upload de Currículo
      </Button>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
        }}>
          <UploadCurriculo />
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
