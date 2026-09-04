import { useAuth } from '../../contexts/AuthContext';
import Perfil from './UploadImagemPerfil';
import Curriculo from './UploadCurriculo';

export default function MobilePerfilTab() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-foreground">Faça login para ver seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-safe">
      <Perfil user={user} isMe />
      <Curriculo isMe />
    </div>
  );
}
