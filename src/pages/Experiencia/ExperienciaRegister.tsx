import {
  Box, Button, Switch, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia';

interface IModal{
  experienciaEdit?: Experiencia;
}

function ExperienciaRegister({ experienciaEdit }: IModal) {
  const [experiencia, setExperiencia] = useState<Experiencia>(experienciaEdit || {
    titulo: '',
    instituicao: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    atualExperiencia: false,
  });
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!experienciaEdit;

  async function submitExperiencia() {
    const newExperiencia = { ...experiencia, dataInicio: `${experiencia.dataInicio}T00:00:00`, dataFim: experiencia.dataFim ? `${experiencia.dataFim}T00:00:00` : experiencia.dataFim };
    if (isEdit) {
      try {
        if (!experiencia.id) return
        await api.experiencia.alterarExperiencia(experiencia.id, newExperiencia);
        enqueueSnackbar('Experiência editada com sucesso', {
          variant: 'success',
        });
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
    } catch (error) {
      enqueueSnackbar('Erro ao adicionar experiência', { variant: 'error' });
    }
  }

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
      width="100%"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: 'white',
        paddingTop: '8px',
      }}
    >
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
  );
}

export default ExperienciaRegister;
