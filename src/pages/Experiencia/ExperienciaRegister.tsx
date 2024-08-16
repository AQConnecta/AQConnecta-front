import {
  Box, Button, Switch, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia';
import {IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface IModal{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

function ExperienciaRegister({isOpen, setOpen}: IModal) {
  if(isOpen){
    const [experiencia, setExperiencia] = useState<Experiencia>({
      titulo: '',
      instituicao: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      atualExperiencia: false,
    });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id: experienciaId } = useParams();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isEdit = !!experienciaId;

    async function submitExperiencia() {
      const newExperiencia = { ...experiencia, dataInicio: `${experiencia.dataInicio}T00:00:00`, dataFim: experiencia.dataFim ? `${experiencia.dataFim}T00:00:00` : experiencia.dataFim };
      if (isEdit) {
        try {
          if (!experiencia.id) return
          await api.experiencia.alterarExperiencia(experiencia.id, newExperiencia);
          enqueueSnackbar('Experiência editada com sucesso', {
            variant: 'success',
          });
          navigate('/experiencias');
        } catch (error) {
          enqueueSnackbar('Erro ao editar experiência', { variant: 'error' });
        }
        return;
      }
      try {
        await api.experiencia.cadastrarExperiencia(newExperiencia);
        enqueueSnackbar('Experiência adicionada com sucesso', {
          variant: 'success',
        });
        navigate('/experiencias');
      } catch (error) {
        enqueueSnackbar('Erro ao adicionar experiência', { variant: 'error' });
      }
    }

    useEffect(() => {
      async function getexperiencia() {
        try {
          if (!experienciaId || !user) return;
          const res = await api.experiencia.localizaExperiencia(experienciaId);
          const exp = res.data.data;
          exp.dataInicio = exp.dataInicio.split('T')[0];
          if (exp.dataFim) exp.dataFim = exp.dataFim.split('T')[0];
          setExperiencia(res.data.data);
        } catch (err) {
          enqueueSnackbar('Erro ao buscar endereço', { variant: 'error' });
        }
      }
      getexperiencia();
    }, [experienciaId]);

    function validateFields() {
      const {
        titulo, instituicao, dataInicio, dataFim, descricao,
      } = experiencia;
      if (experiencia.atualExperiencia) {
        return !(titulo && instituicao && dataInicio && descricao);
      }
      return !(titulo && instituicao && dataInicio && dataFim && descricao);
    }

    const handleKeyPress = useHandleKeyPress({
      verification: validateFields(),
      key: 'Enter',
      callback: () => submitExperiencia(),
    });

    function setExperienciaValue(value: string, field: string) {
      setExperiencia({ ...experiencia, [field]: value });
    }

    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, [handleKeyPress]);

    return (
      <Box
        height="100%"
        width="100%"
        sx={{
          position: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#0000009f',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        }}
      >
        <Box
          width="100%"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: '0 1px 2px #0003',
            backgroundColor: 'white',
            maxWidth: '400px',
            padding: '20px',
            borderRadius: '5px',
          }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Typography variant="h6">
              {isEdit ? 'Editar' : 'Adicionar'}
              {' '}
              experiência
            </Typography>
            <IconButton onClick={() => setOpen(!isOpen)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            variant="outlined"
            placeholder="Título da experiência"
            label="Titulo"
            value={experiencia.titulo}
            onChange={(e) => setExperienciaValue(e.target.value, 'titulo')}
            sx={{ width: '100%' }}
          />
          <TextField
            variant="outlined"
            placeholder="Instituição"
            label="Instituição"
            value={experiencia.instituicao}
            onChange={(e) => setExperienciaValue(e.target.value, 'instituicao')}
            sx={{ width: '100%' }}
          />
          <Box>
            <Box sx={{
              display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', paddingRight: '5px', paddingBottom: '8px',
            }}
            >
              <Switch
                checked={experiencia.atualExperiencia}
                onChange={(e) => setExperienciaValue(`${e.target.checked}`, 'atualExperiencia')}
              />
              <Typography>Experiência atual</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                direction: 'column',
                gap: '12px',
              }}
            >
              <TextField
                variant="outlined"
                type="date"
                placeholder="Data de início"
                label="Data de início"
                InputLabelProps={{ shrink: true }}
                value={experiencia.dataInicio || ''}
                onChange={(e) => setExperienciaValue(e.target.value, 'dataInicio')}
                sx={{ width: '100%' }}
              />
              <TextField
                type="date"
                variant="outlined"
                placeholder="Data de fim"
                label="Data de fim"
                InputLabelProps={{ shrink: true }}
                disabled={experiencia.atualExperiencia}
                value={experiencia.dataFim || ''}
                onChange={(e) => setExperienciaValue(e.target.value, 'dataFim')}
                sx={{ width: '100%' }}
              />
            </Box>
          </Box>
          <TextField
            variant="outlined"
            placeholder="Descrição"
            label="Descrição"
            multiline
            minRows={4}
            value={experiencia.descricao}
            onChange={(e) => setExperienciaValue(e.target.value, 'descricao')}
            sx={{ width: '100%' }}
          />
          <Button
            variant="contained"
            sx={{ width: '100%', height: '50px' }}
            disabled={
              validateFields()
            }
            onClick={() => submitExperiencia()}
          >
            {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
        </Box>
      </Box>
    );
  } else{
    return <></>
  }
}

export default ExperienciaRegister;
