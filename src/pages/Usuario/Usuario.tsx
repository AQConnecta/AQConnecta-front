/* eslint-disable consistent-return */
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import MeuEndereco from '../Endereco/Endereco';
import MinhaExperiencia from '../Experiencia/Experiencia';
import MinhaFormacaoAcademica from '../FormacaoAcademica/FormacaoAcademica';
import MinhasCompetencias from '../MinhasCompetencias/MinhasCompetencias';
import UploadImagemPerfil from '../perfil/UploadImagemPerfil';
import UploadCurriculo from '../perfil/UploadCurriculo';
import api from '../../services/api';
import { Usuario } from '../../services/endpoints/auth';
import { useAuth } from '../../contexts/AuthContext';

function UsuarioProfile() {
  const userUrl = window.location.pathname.split('/').pop();
  const [user, setUser] = useState<Usuario>();
  const { enqueueSnackbar } = useSnackbar();
  const { user: usuarioLogado, setUser: setUserAuth } = useAuth();
  const isMe = userUrl === usuarioLogado?.userUrl || !userUrl;

  useEffect(() => {
    async function getUsuario() {
      try {
        const usuarioRaw = await api.usuario.getUsuario(userUrl!);
        const usuario = usuarioRaw.data.data;
        setUser(usuario);
        if (usuario.userUrl === usuarioLogado?.userUrl) {
          setUserAuth(usuario);
        }
      } catch (err) {
        enqueueSnackbar('Erro ao buscar o usuário', { variant: 'error' });
      }
    }
    if (!userUrl) return setUser(usuarioLogado!);
    getUsuario();
  }, [userUrl]);

  return (
    <Box sx={{ width: '592px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      {user && (
        <>
          <UploadImagemPerfil user={user} isMe={isMe} />
          <UploadCurriculo isMe={isMe} />
          <MinhaFormacaoAcademica user={user} isMe={isMe} />
          <MinhaExperiencia user={user} isMe={isMe} />
          <MeuEndereco user={user} isMe={isMe} />
          <MinhasCompetencias user={user} isMe={isMe} />
        </>
      )}
    </Box>
  );
}

export default UsuarioProfile;
