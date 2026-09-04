import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Plus, Lightbulb, ShieldCheck } from 'lucide-react';
import AdminDatagrid from './AdminDatagrid';
import GerenciarUsuarios from './GerenciarUsuarios';
import GerenciarProjetos from './GerenciarProjetos';
import UniversidadeModal from './components/UniversidadeModal';
import CompetenciaModal from './components/CompetenciaModal';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

type ObjTypes = 'vaga' | 'universidade' | 'competencia' | 'usuario' | 'projeto';

function Admin() {
  const [type, setType] = useState<ObjTypes>('vaga');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCompetencia, setIsOpenCompetencia] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Painel de Administração
          </h1>
          <p className="text-sm text-muted-foreground">Gerencie o conteúdo e os usuários da plataforma.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/denuncias">
              <Flag className="h-4 w-4 mr-2" />
              Denúncias
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/competencias">
              <Lightbulb className="h-4 w-4 mr-2" />
              Sugestões
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={type} onValueChange={(value) => setType(value as ObjTypes)} className="w-full">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="vaga">Vagas</TabsTrigger>
            <TabsTrigger value="universidade">Universidades</TabsTrigger>
            <TabsTrigger value="competencia">Competências</TabsTrigger>
            <TabsTrigger value="usuario">Usuários</TabsTrigger>
            <TabsTrigger value="projeto">Projetos</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {type === 'universidade' && (
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar universidade
              </Button>
            )}
            {type === 'competencia' && (
              <Button onClick={() => setIsOpenCompetencia(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar competência
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="vaga">
          <AdminDatagrid type="vaga" />
        </TabsContent>
        <TabsContent value="universidade">
          <AdminDatagrid type="universidade" />
        </TabsContent>
        <TabsContent value="competencia">
          <AdminDatagrid type="competencia" />
        </TabsContent>
        <TabsContent value="usuario">
          <GerenciarUsuarios />
        </TabsContent>
        <TabsContent value="projeto">
          <GerenciarProjetos />
        </TabsContent>
      </Tabs>

      <UniversidadeModal isOpen={isOpen} handleClose={() => setIsOpen(false)} />
      <CompetenciaModal isOpen={isOpenCompetencia} handleClose={() => setIsOpenCompetencia(false)} />
    </div>
  );
}

export default Admin;
