import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { FaTrash, FaPencil  } from "react-icons/fa6";
import { colors } from '../../styles/colors.ts';
import ExperienciaRegister from './ExperienciaRegister.tsx';

function MinhaExperiencia() {
  const { user } = useAuth();
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [isOpenEditExperiencia, setIsOpenEditExperiencia] = useState(false);
  const [experienciaToEdit, setExperienciaToEdit] = useState<Experiencia | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [shouldReload, setShouldReload] = useState(0);
  const navigate = useNavigate();

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleDelete(idExperiencia: string) {
    try {
      await api.experiencia.deletarExperiencia(idExperiencia);
      enqueueSnackbar('Experiência deletada com sucesso', { variant: 'success' });
      reload()
    } catch (err) {
      enqueueSnackbar('Erro ao deletar experiência', { variant: 'error' });
    }
  }

  async function handleEdit(experiencia: Experiencia) {
    setIsOpenEditExperiencia(true);
    setExperienciaToEdit(experiencia);
    handleClose();
  }

const [open, setOpen] = useState<boolean>(false);

  return (
    <Box
      height="100%"
      width="100%"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '15px',
        padding: '10px',
      }}
    >
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <Typography fontWeight='bold' fontSize='40px' variant="h1">
        Experiências
        </Typography>

        <Typography color='grey'>
        Destaque suas conquistas!
        </Typography>
      </Box>
      <Button variant="contained" onClick={() => setOpen(!open)}>Adicionar experiência</Button>
      <Box
        width="100%"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 2px #0003',
          maxWidth: '350px',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        {experiencias && experiencias.length > 0 ? (
          experiencias.map((experiencia, index) => (
           <Box key={index} sx={{padding: '15px', border: '1px solid lightgrey', borderRadius: '5px', backgroundColor: 'white'}}>
              <Typography variant="h7" sx={{color: 'grey'}}>
                Experiência
                {' '}
                {index + 1}
              </Typography>
              <Typography variant="body1" fontWeight='bold'>
                {experiencia.titulo.toUpperCase()}
                {' '}
                -
                {' '}
                {experiencia.instituicao}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'grey'
                }}
              >
                {formatDate(experiencia.dataInicio)}
                {' '}
                -
                {' '}
                {experiencia.atualExperiencia ? 'até o momento' : formatDate(experiencia.dataFim)}
              </Typography>
              <hr
                style={{
                  color: 'black',
                  backgroundColor: 'red',
                }}
              />
              <Typography variant="body1">
                 {experiencia.descricao}
              </Typography>
              <Box sx={{
                display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
              }}
              >
                <Button variant="contained" sx={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} onClick={() => setOpen(!open)}>
                  <FaPencil />
                  <Typography>  
                     Editar
                  </Typography>
                </Button>
                <Button variant="contained" sx={{ width: '100%', height: '50px', backgroundColor: 'tomato', display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:hover':{backgroundColor: 'red'}}} onClick={() => handleDelete(experiencia.id!)}>
                <FaTrash />
                <Typography>  
                    Excluir
                </Typography>
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography variant="body1">Sem experiências até o momento</Typography>
          </Box>
        )}
      </Box>
      <ExperienciaRegister isOpen={open} setOpen={setOpen}/>
    </Box>

  );
}

export default MinhaExperiencia;
