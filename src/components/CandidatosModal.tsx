import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Vaga } from '../services/endpoints/vaga';
import api from '../services/api';

type CandidatoModalProps = {
    selectedVaga: { titulo: string } | null;
    onClose: () => void;
}

function CandidatosModal(props: CandidatoModalProps) {
  const { onClose, selectedVaga } = props;
  const [candidatos, setCandidatos] = useState<Vaga[]>([]);
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    async function getCandidatos(vaga: Vaga) {
      try {
        const res = await api.vaga.listarCandidatos(vaga.id!);
        setCandidatos(res.data.data);
      } catch (err) {
        enqueueSnackbar('Erro ao buscar candidatos', { variant: 'error' });
      }
    }

    getCandidatos(selectedVaga as Vaga);
  }, [selectedVaga]);

  return (
    <Dialog open={!!selectedVaga} onClose={() => onClose()} fullWidth maxWidth="sm">
      <DialogTitle>
        Candidatos para
        {' '}
        {selectedVaga?.titulo}
      </DialogTitle>
      <DialogContent>
        {candidatos.length ? (
          candidatos.map((candidato, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <Avatar src={candidato.usuario?.fotoPerfil} alt={candidato.usuario?.nome} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography>{candidato.usuario?.nome}</Typography>
                  {/* {candidato.curriculoUrl && (
                    <Link href={`/usuario/${candidato.usuario.id}`} target="_blank" rel="noopener noreferrer">
                      Ver perfil
                    </Link>
                  )} */}
                </Box>
              </Box>
              <Tooltip title="Baixar currículo">
                <IconButton onClick={() => window.open(candidato.curriculoUrl, '_blank')}>
                  <CloudDownloadOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))
        ) : (
          <Typography>Nenhum candidato encontrado</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CandidatosModal;
