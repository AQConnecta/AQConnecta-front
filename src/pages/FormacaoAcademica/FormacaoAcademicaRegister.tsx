/* eslint-disable no-unused-vars */
import {
  Box, Button, Switch, TextField, Typography, Autocomplete,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close'
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';
import { FormacaoAcademica, Universidade } from '../../services/endpoints/formacaoAcademica';

interface IModal{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

function FormacaoAcademicaRegister({ isOpen, setOpen }: IModal) {
  const [formacaoAcademica, setFormacaoAcademica] = useState<FormacaoAcademica>({
    universidade: {
      id: '',
      codigoIes: 0,
      nomeInstituicao: '',
      sigla: '',
      categoriaIes: '',
      organizacaoAcademica: '',
      codigoMunicipioIbge: '',
      municipio: '',
      uf: '',
      situacaoIes: '',
    },
    descricao: '',
    diploma: '',
    dataInicio: '',
    dataFim: '',
    atualFormacao: false,
  });
  const [universidades, setUniversidades] = useState<Universidade[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { id: formacaoId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEdit = !!formacaoId;

  async function submitFormacao() {
    const newFormacao = {
      ...formacaoAcademica,
      dataInicio: `${formacaoAcademica.dataInicio}T00:00:00`,
      dataFim: formacaoAcademica.dataFim ? `${formacaoAcademica.dataFim}T00:00:00` : formacaoAcademica.dataFim,
    };
    if (isEdit) {
      try {
        if (!formacaoAcademica.id) return;
        await api.formacaoAcademica.alterarFormacaoAcademica(formacaoAcademica.id, newFormacao);
        enqueueSnackbar('Formação acadêmica editada com sucesso', {
          variant: 'success',
        });
      } catch (error) {
        enqueueSnackbar('Erro ao editar formação acadêmica', { variant: 'error' });
      }
      return;
    }
    try {
      await api.formacaoAcademica.cadastrarFormacaoAcademica(newFormacao);
      enqueueSnackbar('Formação acadêmica cadastrada com sucesso', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Erro ao cadastrar formação acadêmica', { variant: 'error' });
    }
  }

  useEffect(() => {
    async function getFormacao() {
      try {
        if (!formacaoId || !user) return;
        const res = await api.formacaoAcademica.localizaFormacaoAcademica(formacaoId);
        const formacao = res.data.data;
        formacao.dataInicio = formacao.dataInicio.split('T')[0];
        if (formacao.dataFim) formacao.dataFim = formacao.dataFim.split('T')[0];
        setFormacaoAcademica(formacao);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar formação acadêmica', { variant: 'error' });
      }
    }
    async function getUniversidades() {
      try {
        const res = await api.universidade.getUniversidade();
        setUniversidades(res.data.data || []);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar universidades', { variant: 'error' });
      }
    }
    getFormacao();
    getUniversidades();
  }, [formacaoId]);

  function validateFields() {
    const {
      universidade, descricao, dataInicio, dataFim,
    } = formacaoAcademica;
    if (formacaoAcademica.atualFormacao) {
      return !(universidade && descricao && dataInicio);
    }
    return !(universidade && descricao && dataInicio && dataFim);
  }

  const handleKeyPress = useHandleKeyPress({
    verification: validateFields(),
    key: 'Enter',
    callback: () => submitFormacao(),
  });

  function setFormacaoValue(value: any, field: string) {
    setFormacaoAcademica({ ...formacaoAcademica, [field]: value });
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Dialog open={isOpen} onClose={() => setOpen(false)}>
      <DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {isEdit ? 'Editar' : 'Cadastrar'}
            {' '}
            Formação Acadêmica
          </Typography>
          <IconButton onClick={() => setOpen(!isOpen)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '340px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <Autocomplete
            disablePortal
            id="universidades"
            options={universidades}
            getOptionLabel={(option) => option.nomeInstituicao}
            value={formacaoAcademica.universidade}
            onChange={(_, newValue) => setFormacaoValue(newValue, 'universidade')}
            renderInput={(params) => <TextField {...params} label="Universidade" placeholder="Selecione a universidade" />}
            sx={{ width: '100%' }}
          />
          {/* TODO: Change to uploaded file */}
          {/* <TextField
            variant="outlined"
            placeholder="Diploma"
            label="Diploma"
            value={formacaoAcademica.diploma}
            onChange={(e) => setFormacaoValue(e.target.value, 'diploma')}
            sx={{ width: '100%' }}
          /> */}
          <TextField
            variant="outlined"
            placeholder="Descrição"
            label="Descrição"
            multiline
            minRows={4}
            value={formacaoAcademica.descricao}
            onChange={(e) => setFormacaoValue(e.target.value, 'descricao')}
            sx={{ width: '100%' }}
          />
          <Box sx={{
            display: 'flex', direction: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', paddingRight: '5px', paddingBottom: '8px',
          }}
          >
            <Switch
              checked={formacaoAcademica.atualFormacao}
              onChange={(e) => setFormacaoValue(e.target.checked, 'atualFormacao')}
            />
            <Typography>Formação atual</Typography>
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
              value={formacaoAcademica.dataInicio || ''}
              onChange={(e) => setFormacaoValue(e.target.value, 'dataInicio')}
              sx={{ width: '100%' }}
            />
            <TextField
              type="date"
              variant="outlined"
              placeholder="Data de fim"
              label="Data de fim"
              InputLabelProps={{ shrink: true }}
              disabled={formacaoAcademica.atualFormacao}
              value={formacaoAcademica.dataFim || ''}
              onChange={(e) => setFormacaoValue(e.target.value, 'dataFim')}
              sx={{ width: '100%' }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ padding: '0px 16px 8px 0px' }}>
          <Button
            variant="contained"
            disabled={validateFields()}
            onClick={() => submitFormacao()}
          >
            {isEdit ? 'Salvar' : 'Cadastrar'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default FormacaoAcademicaRegister;
