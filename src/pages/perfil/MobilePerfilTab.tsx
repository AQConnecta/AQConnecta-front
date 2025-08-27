import { Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Perfil from './UploadImagemPerfil';
import Curriculo from './UploadCurriculo';

/**
 * Aba de Perfil para o layout mobile.
 * Mostra o perfil do usuário logado e a lista de currículos (com upload).
 */
export default function MobilePerfilTab() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Faça login para ver seu perfil.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        // garante respiro em devices com “home indicator”
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <Perfil user={user} isMe />
      <Curriculo isMe />
    </Box>
  );
}
