import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { ScrollArea } from '../../components/ui/scroll-area';
import api from '../../services/api';
import { Competencia } from '../../services/endpoints/competencia';
import RelacionarUsuarioCompetencias from './RelacionarUsuarioCompetencias';
import { Usuario } from '../../services/endpoints/auth';
import CustomDialog from '../../components/CustomDialog';
import { handleApiError } from '../../lib/errors';

type CompetenciaProps = {
  user: Usuario;
  isMe: boolean;
};

function MinhaCompetencia(props: CompetenciaProps) {
  const { user, isMe } = props;
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [selectedCompetencias, setSelectedCompetencias] = useState<string[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getCompetencia() {
      try {
        const res = await api.competencia.listByUserId(user.id);
        setCompetencias(res.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar competências');
      }
    }

    getCompetencia();
  }, [shouldReload, user.id]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  const handleSelect = (id: string) => {
    setSelectedCompetencias((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((competenciaId) => competenciaId !== id)
        : [...prevSelected, id]
    );
  };

  async function handleUnlink() {
    try {
      const competenciasEnviar = {
        competencias: selectedCompetencias.map((competencia) => ({ id: competencia })),
      };
      await api.competencia.removeCompetenciaFromMe(competenciasEnviar);
      toast.success('Competências desvinculadas com sucesso');
      setSelectedCompetencias([]);
      reload();
    } catch (error) {
      handleApiError(error, 'Erro ao desvincular competências');
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Competências
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {competencias && competencias.length > 0 ? (
              competencias.map((competencia, index) => (
                <div
                  key={competencia.id || index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <span className="font-medium">{competencia.descricao}</span>
                  {isMe && (
                    <Checkbox
                      checked={selectedCompetencias.includes(competencia.id)}
                      onCheckedChange={() => handleSelect(competencia.id)}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Sem competências adicionadas
              </p>
            )}
          </div>
        </ScrollArea>

        {isMe && (
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar competência
            </Button>
            {selectedCompetencias.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleUnlink}
                className="flex-1"
              >
                Remover Selecionadas
              </Button>
            )}
          </div>
        )}

        <CustomDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Adicionar competência"
        >
          <RelacionarUsuarioCompetencias
            isOpen={open}
            handleClose={() => setOpen(false)}
            user={user}
            onCompetenciasUpdated={reload}
          />
        </CustomDialog>
      </CardContent>
    </Card>
  );
}

export default MinhaCompetencia;
