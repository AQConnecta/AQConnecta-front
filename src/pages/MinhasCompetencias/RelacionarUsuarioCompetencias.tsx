import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import { Competencia } from '../../services/endpoints/competencia';
import { Usuario } from '../../services/endpoints/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { handleApiError } from '../../lib/errors';

type CompetenciaProps = {
  isOpen: boolean;
  handleClose: () => void;
  user: Usuario;
  onCompetenciasUpdated: () => void;
};

function RelacionarUsuarioCompetencias(props: CompetenciaProps) {
  const { isOpen, handleClose, user, onCompetenciasUpdated } = props;
  const [minhasCompetencias, setMinhasCompetencias] = useState<Competencia[]>([]);
  const [competenciasList, setCompetenciasList] = useState<Competencia[]>(user?.competencias || []);
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0);

  function onClose() {
    handleClose();
  }

  async function handleSubmit() {
    try {
      const competenciasEnviar = {
        competencias: minhasCompetencias.map((competencia) => ({ id: competencia.id })),
      };
      await api.competencia.linkCompetenciaToMe(competenciasEnviar);
      toast.success('Competências vinculadas com sucesso');
      onClose();
      onCompetenciasUpdated();
    } catch (error) {
      handleApiError(error, 'Erro ao relacionar competências');
    }
  }

  useEffect(() => {
    async function loadCompetencias() {
      try {
        const competenciasListRaw = await api.competencia.listAll(search, 0, 100);
        setCompetenciasList(competenciasListRaw.data.data);
      } catch (error) {
        handleApiError(error, 'Erro ao carregar competências');
        setReload((prev) => prev + 1);
      }
    }
    loadCompetencias();
  }, [search, reload]);

  const toggleCompetencia = (competencia: Competencia) => {
    setMinhasCompetencias((prev) => {
      const exists = prev.find((c) => c.id === competencia.id);
      if (exists) {
        return prev.filter((c) => c.id !== competencia.id);
      }
      return [...prev, competencia];
    });
  };

  const isSelected = (competencia: Competencia) => {
    return minhasCompetencias.some((c) => c.id === competencia.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Relacionar competências
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Competências selecionadas</Label>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-muted/50">
              {minhasCompetencias.length === 0 ? (
                <span className="text-muted-foreground text-sm">
                  Nenhuma competência selecionada
                </span>
              ) : (
                minhasCompetencias.map((competencia) => (
                  <Badge
                    key={competencia.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleCompetencia(competencia)}
                  >
                    {competencia.descricao}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Buscar competências</Label>
            <Input
              id="search"
              placeholder="Digite para filtrar as competências"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Competências disponíveis</Label>
            <ScrollArea className="h-48 border rounded-md">
              <div className="p-2 space-y-1">
                {competenciasList.map((competencia) => (
                  <div
                    key={competencia.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                      isSelected(competencia) ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => toggleCompetencia(competencia)}
                  >
                    <Checkbox
                      checked={isSelected(competencia)}
                      onCheckedChange={() => toggleCompetencia(competencia)}
                    />
                    <span className="text-sm flex-1">{competencia.descricao}</span>
                    {isSelected(competencia) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Relacionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RelacionarUsuarioCompetencias;
