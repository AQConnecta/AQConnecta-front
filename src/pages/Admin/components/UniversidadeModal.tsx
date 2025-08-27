import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../services/api';
import { PartialUniversidade, Universidade } from '../../../services/endpoints/formacaoAcademica';

  type UniversidadeModalProps = {
    isOpen: boolean;
    handleClose: () => void;
    editObj?: Universidade | null;
  };

const universidadeDefaultValues: PartialUniversidade = {
  codigoIes: 0,
  nomeInstituicao: '',
  sigla: '',
  categoriaIes: '',
  organizacaoAcademica: '',
  codigoMunicipioIbge: '',
  municipio: '',
  uf: '',
  situacaoIes: '',
};

const organizacaoAcademicaOptions = [
  'Faculdade',
  'Universidade',
  'Centro Universitário',
  'Instituto Federal de Educação, Ciência e Tecnologia',
  'Instituto Superior ou Escola Superior',
  'Escola de Governo',
  'Instituição Especialmente Credenciada para oferta de cursos lato sensu',
  'Centro Federal de Educação Tecnológica',
  'Faculdades Integradas',
  'Faculdade de Tecnologia',
];

const situacaoIesOptions = ['Ativa', 'Extinta'];

function UniversidadeModal(props: UniversidadeModalProps) {
  const { isOpen, handleClose, editObj } = props;
  const [universidade, setUniversidade] = useState<Universidade>(
    editObj || (universidadeDefaultValues as Universidade),
  );
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = !!editObj;

  function setUniversidadeValue(value: string | number, field: string) {
    setUniversidade({ ...universidade, [field]: value });
  }

  function clearFields() {
    setUniversidade(universidadeDefaultValues as Universidade);
  }

  function onClose() {
    clearFields();
    handleClose();
  }

  async function handleSubmit() {
    try {
      if (isEdit) {
        await api.universidade.alterarUniversidade(editObj?.id!, { ...universidade });
        enqueueSnackbar('Universidade editada com sucesso', { variant: 'success' });
        onClose();
        return;
      }
      await api.universidade.cadastrarUniversidade({ ...universidade });
      enqueueSnackbar('Universidade criada com sucesso', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar('Erro ao criar universidade', { variant: 'error' });
    }
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '400px', gap: '8px', padding: '8px' }}>
          {isEdit ? 'Editar universidade' : 'Nova universidade'}
          <IconButton onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            maxWidth: '500px',
            padding: '8px',
          }}
        >
          <TextField
            variant="outlined"
            label="Nome da Instituição"
            value={universidade.nomeInstituicao}
            onChange={(e) => setUniversidadeValue(e.target.value, 'nomeInstituicao')}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Sigla"
            value={universidade.sigla}
            onChange={(e) => setUniversidadeValue(e.target.value, 'sigla')}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="Código IES"
            value={universidade.codigoIes}
            onChange={(e) => setUniversidadeValue(e.target.value, 'codigoIes')}
            fullWidth
          />

          {/* Select for Organização Acadêmica */}
          <FormControl fullWidth>
            <Typography variant="body1">Organização Acadêmica</Typography>
            <Select
              value={universidade.organizacaoAcademica}
              onChange={(e) => setUniversidadeValue(e.target.value, 'organizacaoAcademica')}
              displayEmpty
              fullWidth
            >
              {organizacaoAcademicaOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            label="Município"
            value={universidade.municipio}
            onChange={(e) => setUniversidadeValue(e.target.value, 'municipio')}
            fullWidth
          />
          <TextField
            variant="outlined"
            label="UF"
            value={universidade.uf}
            onChange={(e) => setUniversidadeValue(e.target.value, 'uf')}
            fullWidth
          />

          {/* Select for Situação IES */}
          <FormControl fullWidth>
            <Typography variant="body1">Situação IES</Typography>
            <Select
              value={universidade.situacaoIes}
              onChange={(e) => setUniversidadeValue(e.target.value, 'situacaoIes')}
              displayEmpty
              fullWidth
            >
              {situacaoIesOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', gap: '16px', padding: '0 24px 16px 24px' }}>
          <Button onClick={() => onClose()} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={() => handleSubmit()} color="primary" variant="contained">
            {isEdit ? 'Editar' : 'Criar'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default UniversidadeModal;
