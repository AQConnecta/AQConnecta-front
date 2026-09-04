/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import MeuEndereco from '../Endereco/Endereco';
import MinhaExperiencia from '../Experiencia/Experiencia';
import MinhaFormacaoAcademica from '../FormacaoAcademica/FormacaoAcademica';
import MinhasCompetencias from '../MinhasCompetencias/MinhasCompetencias';
import UploadImagemPerfil from '../perfil/UploadImagemPerfil';
import UploadCurriculo from '../perfil/UploadCurriculo';
import api from '../../services/api';
import { Usuario } from '../../services/endpoints/auth';
import { useAuth } from '../../contexts/AuthContext';
import { handleApiError } from '../../lib/errors';

function UsuarioProfile() {
  const { user: usuarioLogado, setUser: setUserAuth } = useAuth();
  let userUrl = window.location.pathname.split('/').pop();
  if (userUrl === 'usuario') userUrl = usuarioLogado?.userUrl;
  const [user, setUser] = useState<Usuario>();
  const isMe = userUrl === usuarioLogado?.userUrl;

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
        handleApiError(err, 'Erro ao buscar o usuário');
      }
    }
    if (!userUrl) return setUser(usuarioLogado!);
    getUsuario();
  }, [userUrl]);

  return (
    <div className="w-full max-w-[592px] mx-auto flex flex-col items-center justify-center gap-4">
      {user && (
        <>
          <UploadImagemPerfil
            user={user}
            isMe={isMe}
            onUploaded={(url) => {
              setUser((prev) => (prev ? { ...prev, fotoPerfil: url } : prev));
              if (isMe && usuarioLogado) {
                const atualizado = { ...usuarioLogado, fotoPerfil: url };
                setUserAuth(atualizado);
                localStorage.setItem('user', JSON.stringify(atualizado));
              }
            }}
          />
          {isMe && (
            <UploadCurriculo isMe={isMe} />
          )}
          <MinhaFormacaoAcademica user={user} isMe={isMe} />
          <MinhaExperiencia user={user} isMe={isMe} />
          <MeuEndereco user={user} isMe={isMe} />
          <MinhasCompetencias user={user} isMe={isMe} />
        </>
      )}
    </div>
  );
}

export default UsuarioProfile;
