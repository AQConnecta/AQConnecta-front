/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, RadioGroup, FormControlLabel, Radio, IconButton, Link } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../../contexts/AuthContext';
import { PerfilEndpoint } from '../../../services/endpoints/perfil';

function SelecionarCurriculo({ isOpen, handleClose, onSelect }: { isOpen: boolean, handleClose: () => void, onSelect: (curriculoId: string) => void }) {
  const [curriculos, setCurriculos] = useState<Array<{ id: string, nome: string, url: string }>>([]);
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
          id: curriculo.id.toString(),
          nome: curriculo.nomeCuriculo,
          url: curriculo.curriculo,
        }));

        setCurriculos(formattedCurriculos);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar os currículos', { variant: 'error' });
      }
    }

    if (user?.id) {
      getCurriculos();
    }
  }, [user]);

  const handleSelect = () => {
    if (selectedCurriculo) {
      onSelect(selectedCurriculo);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
        width: '400px',
      }}
      >
        <Typography variant="h6" sx={{ marginBottom: '16px' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton component={Link} href={curriculo.url} target="_blank" rel="noopener" sx={{ marginRight: '8px' }}>
                    <PictureAsPdfOutlinedIcon color="error" />
                  </IconButton>
                  {curriculo.nome}
                </Box>
              )}
            />
          ))}
        </RadioGroup>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSelect} disabled={!selectedCurriculo}>
            Selecionar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default SelecionarCurriculo;
