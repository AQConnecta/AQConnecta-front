import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, RadioGroup, FormControlLabel, Radio, IconButton, Link } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../../contexts/AuthContext';
import { Curriculo, PerfilEndpoint } from '../../../services/endpoints/perfil';

function SelecionarCurriculo({ isOpen, handleClose, onSelect }: { isOpen: boolean, handleClose: () => void, onSelect: (curriculoId: string) => void }) {
  const [curriculos, setCurriculos] = useState<Array<Curriculo>>([]);
  const [selectedCurriculo, setSelectedCurriculo] = useState<string | null>(null);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function getCurriculos() {
      try {
        const perfilEndpoint = new PerfilEndpoint();
        const response = await perfilEndpoint.getCurriculos();
        const curriculosRaw = response.data.data;

        const formattedCurriculos = curriculosRaw.map((curriculo) => ({
          id: String(curriculo.id),
          nome: curriculo.nomeCurriculo,
          url: curriculo.curriculo,
        }));

        setCurriculos(formattedCurriculos);
      } catch {
        enqueueSnackbar('Erro ao buscar os currículos', { variant: 'error' });
      }
    }

    if (user?.id) getCurriculos();
  }, [user, enqueueSnackbar]);

  const handleSelect = () => {
    if (selectedCurriculo) onSelect(selectedCurriculo);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          width: { xs: '90vw', sm: 480 },
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Selecionar Currículo
        </Typography>
        <RadioGroup
          value={selectedCurriculo}
          onChange={(e) => setSelectedCurriculo(e.target.value)}
        >
          {curriculos.map((curriculo) => (
            <FormControlLabel
              key={curriculo.id}
              value={curriculo.id}
              control={<Radio />}
              label={(
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton component={Link} href={curriculo.url} target="_blank" rel="noopener">
                    <PictureAsPdfOutlinedIcon color="error" />
                  </IconButton>
                  {curriculo.nome}
                </Box>
              )}
            />
          ))}
        </RadioGroup>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
          <Button variant="outlined" onClick={handleClose} fullWidth>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSelect} disabled={!selectedCurriculo} fullWidth>
            Selecionar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default SelecionarCurriculo;
