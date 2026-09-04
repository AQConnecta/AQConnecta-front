import * as React from 'react';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import type { Usuario } from '../../services/endpoints/auth';
import { handleApiError } from '../../lib/errors';

import UploadCurriculo from '../perfil/UploadCurriculo';
import MinhaFormacaoAcademica from '../FormacaoAcademica/FormacaoAcademica';
import MinhaExperiencia from '../Experiencia/Experiencia';
import MeuEndereco from '../Endereco/Endereco';
import MinhasCompetencias from '../MinhasCompetencias/MinhasCompetencias';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-base">{title}</h3>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default function UsuarioProfileMobile() {
  const { user: usuarioLogado, setUser: setUserAuth } = useAuth();
  const [user, setUser] = React.useState<Usuario | undefined>(usuarioLogado as Usuario | undefined);
  const [tab, setTab] = React.useState('formacao');

  const isMe = true;

  React.useEffect(() => {
    async function refreshUser() {
      if (!usuarioLogado?.userUrl) return;
      try {
        const res = await api.usuario.getUsuario(usuarioLogado.userUrl);
        const u: Usuario = res.data.data;
        setUser(u);
        setUserAuth(u);
      } catch (err) {
        handleApiError(err, 'Erro ao atualizar o perfil.');
      }
    }
    refreshUser();
  }, []);

  const avatarSrc = user?.fotoPerfil || '';
  const initials = user?.nome
    ? user.nome
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : 'U';

  return (
    <div className="px-4 py-4 max-w-lg mx-auto bg-muted/30 min-h-full">
      {/* Hero Card */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <Avatar className="h-16 w-16 border-2 border-background">
              <AvatarImage src={avatarSrc} alt={user?.nome ?? 'Usuário'} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-lg leading-tight">
                {user?.nome ?? 'Usuário'}
              </h2>
              {user?.email && (
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              )}
              <div className="mt-2 flex gap-2 flex-wrap">
                <Badge variant="outline">Perfil</Badge>
                <Badge variant="secondary">Conectado</Badge>
              </div>
            </div>
          </div>

          {isMe && (
            <div className="mt-4">
              <UploadCurriculo isMe />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="formacao">Formação</TabsTrigger>
            <TabsTrigger value="experiencia">Experiência</TabsTrigger>
            <TabsTrigger value="competencias">Competências</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[300px]">
            <TabsContent value="formacao" className="p-4 mt-0">
              <Section title="Formação Acadêmica">
                {user && <MinhaFormacaoAcademica user={user} isMe={isMe} />}
              </Section>
            </TabsContent>

            <TabsContent value="experiencia" className="p-4 mt-0">
              <Section title="Experiência">
                {user && <MinhaExperiencia user={user} isMe={isMe} />}
              </Section>
            </TabsContent>

            <TabsContent value="competencias" className="p-4 mt-0">
              <Section title="Competências">
                {user && <MinhasCompetencias user={user} isMe={isMe} />}
              </Section>
            </TabsContent>

            <TabsContent value="endereco" className="p-4 mt-0">
              <Section title="Endereço">
                {user && <MeuEndereco user={user} isMe={isMe} />}
              </Section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
}
