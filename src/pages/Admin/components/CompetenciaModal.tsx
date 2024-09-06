import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import api from '../../../services/api';

  type CompetenciaModalProps = {
    isOpen: boolean;
    handleClose: () => void;
  };

  type Competencia = {
    id: string
    descricao: string
}

const competenciaDefaultValues: Competencia = {
  descricao: '',
};

function CompetenciaModal(props: CompetenciaModalProps) {
  const { isOpen, handleClose } = props;
  const [competencia, setCompetencia] = useState<Competencia>(competenciaDefaultValues);
  const { enqueueSnackbar } = useSnackbar();

  function setCompetenciaValue(value: string | number, field: string) {
    setCompetencia({ ...competencia, [field]: value });
  }

  function clearFields() {
    setCompetencia(competenciaDefaultValues as Competencia);
  }

  function onClose() {
    clearFields();
    handleClose();
  }

  async function handleSubmit() {
    try {
      await api.competencia.cadastrarCompetencia({ ...competencia });
      enqueueSnackbar('Competencia criada com sucesso', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar('Erro ao criar Competencia', { variant: 'error' });
    }
  }

  return (
    <Dialog open={isOpen} onClose={() => onClose()}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '400px', gap: '8px', padding: '8px' }}>
          Nova Competencia
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
            label="Descrição da competência"
            value={competencia.descricao}
            onChange={(e) => setCompetenciaValue(e.target.value, 'descricao')}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex', gap: '16px', padding: '0 24px 16px 24px' }}>
          <Button onClick={() => onClose()} color="primary" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={() => handleSubmit()} color="primary" variant="contained">
            Criar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default CompetenciaModal;
