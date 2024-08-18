import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { FaTrash, FaPencil } from "react-icons/fa6";
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import ExperienciaRegister from './ExperienciaRegister.tsx';

function MinhaExperiencia() {
  const { user } = useAuth();
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [isOpenEditExperiencia, setIsOpenEditExperiencia] = useState(false);
  const [experienciaToEdit, setExperienciaToEdit] = useState<Experiencia | null>(null);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getExperiencia() {
      try {
        const res = await api.experiencia.getExperiencia(user.id);
        setExperiencias(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar experiencia', { variant: 'error' });
      }
    }

    getExperiencia();
  }, [shouldReload]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  const formatDate = (dateString: string) => {
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  async function handleDelete(idExperiencia: string) {
    try {
      await api.experiencia.deletarExperiencia(idExperiencia);
      enqueueSnackbar('Experiência deletada com sucesso', { variant: 'success' });
      reload();
    } catch (err) {
      enqueueSnackbar('Erro ao deletar experiência', { variant: 'error' });
    }
  }

  async function handleEdit(experiencia: Experiencia) {
    setIsOpenEditExperiencia(true);
    setExperienciaToEdit(experiencia);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px',
        width: '90%',
        margin: 'auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0a66c2' }}>
        Experiências
      </Typography>
      <Typography variant="body1" sx={{ color: 'grey', marginBottom: '16px' }}>
        Destaque suas conquistas!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        {experiencias && experiencias.length > 0 ? (
          experiencias.map((experiencia, index) => (
            <Box
              key={index}
              sx={{
                padding: '20px',
                border: '1px solid #e1e4e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#495057' }}>
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {experiencia.titulo.toUpperCase()} - {experiencia.instituicao}
              </Typography>
              <Typography variant="body2" sx={{ color: '#868e96', marginBottom: '8px' }}>
                {formatDate(experiencia.dataInicio)} - {experiencia.atualExperiencia ? 'até o momento' : formatDate(experiencia.dataFim)}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '16px' }}>
                {experiencia.descricao}
              </Typography>
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#0a66c2',
                    borderColor: '#0a66c2',
                    flexGrow: 1,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#e1e4e8', borderColor: '#0a66c2' },
                  }}
                  onClick={() => handleEdit(experiencia)}
                >
                  <FaPencil style={{ marginRight: '8px' }} />
                  Editar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#d9534f',
                    color: 'white',
                    flexGrow: 1,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#c9302c' },
                  }}
                  onClick={() => handleDelete(experiencia.id!)}
                >
                  <FaTrash style={{ marginRight: '8px' }} />
                  Excluir
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: 'grey', textAlign: 'center' }}>
            Sem experiências até o momento
          </Typography>
        )}
      </Box>
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
        onClick={() => setOpen(!open)}
      >
        Adicionar experiência
      </Button>
      <ExperienciaRegister isOpen={open} setOpen={setOpen} />
    </Box>
  );
}

export default MinhaExperiencia;
