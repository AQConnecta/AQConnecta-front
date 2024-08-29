/* eslint-disable consistent-return */
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
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
  const { id: userId } = useParams();
  const [user, setUser] = useState<Usuario>();
  const { enqueueSnackbar } = useSnackbar()
  const { user: usuarioLogado, setUser: setUserAuth } = useAuth()
  const isMe = userId === usuarioLogado?.id || !userId

  useEffect(() => {
    async function getUsuario() {
      try {
        const usuarioRaw = await api.usuario.getUsuario(userId!);
        const usuario = usuarioRaw.data.data;
        setUser(usuario);
        if (usuario.id === usuarioLogado?.id) {
          setUserAuth(usuario);
        }
      } catch (err) {
        enqueueSnackbar('Erro ao buscar o usuário', { variant: 'error' });
      }
    }
    if (!userId) return setUser(usuarioLogado!)
    getUsuario();
  }, [userId]);

  return (
    <Box sx={{ width: '592px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      { user && (
        <>
          { isMe && (
            <UploadImagemPerfil user={user} />
          )}
          { isMe && (
            <UploadCurriculo />
          )}
          <MinhaFormacaoAcademica user={user} />
          <MinhaExperiencia user={user} />
          <MeuEndereco user={user} />
          <MinhasCompetencias user={user}/>
        </>
      ) }
    </Box>
  );
}

export default UsuarioProfile;
