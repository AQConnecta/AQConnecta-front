import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Input, Modal, IconButton } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { PerfilEndpoint } from '../../services/endpoints/perfil';
import api from '../../services/api';

function UploadCurriculo() {
  const [file, setFile] = useState<File | null>(null);
  const [curriculos, setCurriculos] = useState<Array<{ id: string, nome: string, url: string }>>([]);
  const perfilEndpoint = new PerfilEndpoint();

  useEffect(() => {
    async function fetchCurriculos() {
      try {
        const res = await api.perfil.getCurriculos();
        const fetchedCurriculos = Object.keys(res.data.data).map((key) => ({
          id: key,
          nome: res.data.data[key].split('/').pop(),
          url: res.data.data[key],
        }));
        setCurriculos(fetchedCurriculos);
      } catch (error) {
        enqueueSnackbar('Erro ao buscar currículos', { variant: 'error' });
      }
    }

    fetchCurriculos();
  }, []);

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
      setCurriculos((prev) => [...prev, { id: response.data.id, nome: file.name, url: response.data.url }]);
    } catch (error) {
      enqueueSnackbar('Erro ao fazer upload do currículo. Tente novamente.', { variant: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      enqueueSnackbar('Currículo excluído com sucesso!', { variant: 'success' });
      setCurriculos((prev) => prev.filter((curriculo) => curriculo.id !== id));
    } catch (error) {
      enqueueSnackbar('Erro ao excluir currículo', { variant: 'error' });
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
        Gerenciar Currículos
      </Typography>

      <Box sx={{ width: '100%', marginBottom: '20px' }}>
        {curriculos.map((curriculo) => (
          <Box
            key={curriculo.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginBottom: '10px',
              backgroundColor: '#fff',
            }}
          >
            <a href={curriculo.url} target="_blank" rel="noopener noreferrer">
              <Typography variant="body1" sx={{ color: '#0a66c2', fontWeight: 'bold' }}>
                {curriculo.nome}
              </Typography>
            </a>
            <Box>
              <IconButton onClick={() => handleDelete(curriculo.id)} color="error">
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Input
        type="file"
        onChange={handleFileChange}
        sx={{ marginBottom: '20px' }}
        inputProps={{ accept: '.pdf,.doc,.docx' }}
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
        Adicionar Currículo
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
        }}
        >
          <UploadCurriculo />
        </Box>
      </Modal>
    </Box>
  );
}

export default App;
