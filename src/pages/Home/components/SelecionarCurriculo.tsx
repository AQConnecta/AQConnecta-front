import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, RadioGroup, FormControlLabel, Radio, IconButton, Link } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { PerfilEndpoint } from '../../../services/endpoints/perfil';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

function SelecionarCurriculo({ isOpen, handleClose, onSelect }: { isOpen: boolean, handleClose: () => void, onSelect: (curriculoId: string) => void }) {
  const [curriculos, setCurriculos] = useState<Array<{ id: string, nome: string, url: string }>>([]);
  const [selectedCurriculo, setSelectedCurriculo] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function getCurriculos() {
      try {
        const perfilEndpoint = new PerfilEndpoint();
        const response = await perfilEndpoint.getCurriculos();
        const curriculos = response.data.data;

        // Convertendo a resposta em um array de objetos
        const formattedCurriculos = Object.keys(curriculos).map(key => {
          const url = curriculos[key];
          const nome = url.match(/[^/]+$/)?.[0] || 'Nome desconhecido'; // Extraindo o nome do arquivo

          return {
            id: key,
            nome,
            url
          };
        });

        setCurriculos(formattedCurriculos);
      } catch (err) {
        console.error('Erro ao buscar currículos', err);
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
      }}>
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
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton component={Link} href={curriculo.url} target="_blank" rel="noopener" sx={{ marginRight: '8px' }}>
                    <PictureAsPdfOutlinedIcon color="error" />
                  </IconButton>
                  {curriculo.nome}
                </Box>
              }
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
