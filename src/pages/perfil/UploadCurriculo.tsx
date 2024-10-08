import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Input, IconButton, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { PerfilEndpoint } from '../../services/endpoints/perfil';
import api from '../../services/api';
import Card from '../../components/Card';
import CustomDialog from '../../components/CustomDialog';

function UploadCurriculo({ setCurriculos, handleClose }: { setCurriculos: React.Dispatch<React.SetStateAction<{ id: string; nome: string; url: string; }[]>>, handleClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [nome, setNome] = useState('');
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
      const response = await perfilEndpoint.uploadCurriculo(file, nome);
      enqueueSnackbar('Currículo enviado com sucesso!', { variant: 'success' });
      setCurriculos((prev) => [...prev, { id: response.data.id, nome: file.name, url: response.data.url }]);
      handleClose();
    } catch (error) {
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
        maxWidth: '500px',
        paddingTop: '8px',
      }}
    >

      <TextField
        label="Nome do currículo"
        fullWidth
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <Input
        type="file"
        onChange={handleFileChange}
        sx={{ marginBottom: '20px' }}
        inputProps={{ accept: '.pdf,.doc,.docx' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
      >
        Adicionar Currículo
      </Button>
    </Box>
  );
}

function Curriculo({ isMe }: { isMe: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curriculos, setCurriculos] = useState<Array<{ id: string, nome: string, url: string }>>([]);
  const [shouldUpdate, setShouldUpdate] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShouldUpdate((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    try {
      enqueueSnackbar('Currículo excluído com sucesso!', { variant: 'success' });
      setCurriculos((prev) => prev.filter((curriculo) => curriculo.id !== id));
    } catch (error) {
      enqueueSnackbar('Erro ao excluir currículo', { variant: 'error' });
    }
  };

  useEffect(() => {
    async function fetchCurriculos() {
      try {
        const res = await api.perfil.getCurriculos();
        const fetchedCurriculos = res.data.data.map((curriculo) => ({
          id: curriculo.id,
          nome: curriculo.nomeCurriculo,
          url: curriculo.curriculo,
        }));
        setCurriculos(fetchedCurriculos);
      } catch (error) {
        enqueueSnackbar('Erro ao buscar currículos', { variant: 'error' });
      }
    }

    fetchCurriculos();
  }, [shouldUpdate]);

  return (
    <Card sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: '20px', alignSelf: 'flex-start', padding: '8px', gap: '16px', fontWeight: 600 }}>Currículos</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ width: '70%' }}>
          {curriculos.map((curriculo) => (
            <Box
              key={curriculo.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#fff',
              }}
            >
              <a href={curriculo.url} target="_blank" rel="noopener noreferrer">
                <Typography variant="body1" sx={{ color: '#0a66c2', fontWeight: 'bold' }}>
                  {curriculo.nome}
                </Typography>
              </a>
              <Box>
                {isMe
                  && (
                    <IconButton onClick={() => handleDelete(curriculo.id)} color="error">
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  )}
              </Box>
            </Box>
          ))}
        </Box>
        {isMe
          && (
            <Button
              variant="contained"
              onClick={handleOpenModal}
              color="primary"
            >
              Enviar novo currículo
            </Button>
          )}

        <CustomDialog isOpen={isModalOpen} onClose={handleCloseModal} title="Enviar Currículo">
          <UploadCurriculo setCurriculos={setCurriculos} handleClose={() => handleCloseModal()} />
        </CustomDialog>
      </Box>
    </Card>
  );
}

export default Curriculo;
