import * as React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import { enqueueSnackbar } from 'notistack';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import type { Usuario } from '../../services/endpoints/auth';

import UploadCurriculo from '../perfil/UploadCurriculo';
import MinhaFormacaoAcademica from '../FormacaoAcademica/FormacaoAcademica';
import MinhaExperiencia from '../Experiencia/Experiencia';
import MeuEndereco from '../Endereco/Endereco';
import MinhasCompetencias from '../MinhasCompetencias/MinhasCompetencias';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

export default function UsuarioProfileMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user: usuarioLogado, setUser: setUserAuth } = useAuth();
  const [user, setUser] = React.useState<Usuario | undefined>(usuarioLogado as Usuario | undefined);
  const [loading, setLoading] = React.useState(false);
  const [tab, setTab] = React.useState(0);

  const isMe = true;

  React.useEffect(() => {
    async function refreshUser() {
      if (!usuarioLogado?.userUrl) return;
      try {
        setLoading(true);
        const res = await api.usuario.getUsuario(usuarioLogado.userUrl);
        const u: Usuario = res.data.data;
        setUser(u);
        setUserAuth(u);
      } catch {
        enqueueSnackbar('Erro ao atualizar o perfil.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    refreshUser();
  }, []);

  const avatarSrc = user?.fotoPerfil || 'https://ui-avatars.com/api/?name=Carlos+Silva&size=128&background=0A66C2&color=fff';

  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        maxWidth: 600,
        mx: 'auto',
        bgcolor: '#f4f2ee',
        minHeight: '100%',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Hero */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 2,
          background:
            'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(249,251,255,1) 100%)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar
            src={avatarSrc}
            alt={user?.nome ?? 'Usuário'}
            sx={{ width: 72, height: 72, border: '2px solid #fff' }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {user?.nome ?? 'Usuário'}
            </Typography>
            {user?.email && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            )}
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip size="small" label="Perfil" color="primary" variant="outlined" />
              <Chip size="small" label="Conectado" variant="outlined" />
            </Box>
          </Box>
        </Box>

        {isMe && (
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr', gap: 1.25 }}>
            <UploadCurriculo isMe />
          </Box>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)',
          bgcolor: 'background.paper',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Abas do perfil"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 44 },
          }}
        >
          <Tab label="Formação" />
          <Tab label="Experiência" />
          <Tab label="Competências" />
          <Tab label="Endereço" />
        </Tabs>

        <Divider />

        <Box sx={{ minHeight: 240 }}>
          <SwipeableViews index={tab} onChangeIndex={setTab} resistance>
            <Box sx={{ p: 2 }}>
              <Section title="Formação Acadêmica">
                {user && <MinhaFormacaoAcademica user={user} isMe={isMe} />}
              </Section>
            </Box>

            <Box sx={{ p: 2 }}>
              <Section title="Experiência">
                {user && <MinhaExperiencia user={user} isMe={isMe} />}
              </Section>
            </Box>

            <Box sx={{ p: 2 }}>
              <Section title="Competências">
                {user && <MinhasCompetencias user={user} isMe={isMe} />}
              </Section>
            </Box>

            <Box sx={{ p: 2 }}>
              <Section title="Endereço">
                {user && <MeuEndereco user={user} isMe={isMe} />}
              </Section>
            </Box>
          </SwipeableViews>
        </Box>
      </Paper>


      <Box sx={{ height: isMobile ? 12 : 0 }} />
    </Box>
  );
}
