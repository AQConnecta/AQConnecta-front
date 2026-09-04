import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { UsuarioFilter } from '../services/endpoints/usuario';

type UsuarioProps = {
  usuario: UsuarioFilter;
}

function UsuarioCard({ usuario }: UsuarioProps) {
  const { user } = useAuth();
  const isMyProfile = usuario.id === user?.id;

  return (
    <Card className="w-full max-w-[500px]">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={usuario.fotoPerfil} alt="Imagem de perfil" />
                <AvatarFallback>
                  {usuario.nome?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{usuario.nome}</p>
                <p className="text-sm text-muted-foreground">{usuario.email}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            {!isMyProfile && (
              <Link to={`/usuario/${usuario.userUrl}`}>
                <Button size="sm">
                  Ver Perfil
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UsuarioCard;
