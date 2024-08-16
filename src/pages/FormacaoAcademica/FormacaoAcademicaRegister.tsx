import {
  Box, Button, Switch, TextField, Typography, Autocomplete,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';
import { FormacaoAcademica, Universidade } from '../../services/endpoints/formacaoAcademica';
import {IconButton} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface IModal{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

function FormacaoAcademicaRegister({isOpen, setOpen}: IModal) {
  if(isOpen){
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
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id: formacaoId } = useParams();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isEdit = !!formacaoId;

    async function submitFormacao() {
      const newFormacao = { 
        ...formacaoAcademica, 
        dataInicio: `${formacaoAcademica.dataInicio}T00:00:00`, 
        dataFim: formacaoAcademica.dataFim ? `${formacaoAcademica.dataFim}T00:00:00` : formacaoAcademica.dataFim 
      };
      if (isEdit) {
        try {
          if (!formacaoAcademica.id) return;
          await api.formacaoAcademica.alterarFormacaoAcademica(formacaoAcademica.id, newFormacao);
          enqueueSnackbar('Formação acadêmica editada com sucesso', {
            variant: 'success',
          });
          navigate('/formacoes_academicas');
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
        navigate('/formacoes_academicas');
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
      <Box
        height="100%"
        width="100%"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          position: 'fixed',
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
              {isEdit ? 'Editar' : 'Cadastrar'}
              {' '}
              Formação Acadêmica
            </Typography>
            <IconButton onClick={() => setOpen(!isOpen)}>
                <CloseIcon />
              </IconButton>
          </Box>
          <Autocomplete
            disablePortal
            id="universidades"
            options={universidades}
            getOptionLabel={(option) => option.nomeInstituicao}
            value={formacaoAcademica.universidade}
            onChange={(event, newValue) => setFormacaoValue(newValue, 'universidade')}
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
          <Box>
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
          <Button
            variant="contained"
            sx={{ width: '100%', height: '50px' }}
            disabled={validateFields()}
            onClick={() => submitFormacao()}
          >
            {isEdit ? 'Salvar' : 'Cadastrar'}
          </Button>
        </Box>
      </Box>
    );
  } else{
    return <></>
  }
}

export default FormacaoAcademicaRegister;
