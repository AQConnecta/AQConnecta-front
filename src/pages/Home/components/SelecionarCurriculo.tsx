/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../contexts/AuthContext';
import { Curriculo, PerfilEndpoint } from '../../../services/endpoints/perfil';
import { handleApiError } from '../../../lib/errors';

type SelecionarCurriculoProps = {
  isOpen: boolean;
  handleClose: () => void;
  onSelect: (curriculoId: string) => void;
}

function SelecionarCurriculo({ isOpen, handleClose, onSelect }: SelecionarCurriculoProps) {
  const [curriculos, setCurriculos] = useState<Array<Curriculo>>([]);
  const [selectedCurriculo, setSelectedCurriculo] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function getCurriculos() {
      try {
        const perfilEndpoint = new PerfilEndpoint();
        const response = await perfilEndpoint.getCurriculos();
        setCurriculos(response.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar os currículos');
      }
    }

    if (user?.id) {
      getCurriculos();
    }
  }, [user]);

  const handleSelect = () => {
    if (selectedCurriculo) {
      onSelect(selectedCurriculo);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Selecionar Currículo</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {curriculos.length > 0 ? (
            curriculos.map((curriculo) => (
              <label
                key={curriculo.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCurriculo === curriculo.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-accent'
                }`}
              >
                <input
                  type="radio"
                  name="curriculo"
                  value={curriculo.id}
                  checked={selectedCurriculo === curriculo.id}
                  onChange={(e) => setSelectedCurriculo(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedCurriculo === curriculo.id
                    ? 'border-primary'
                    : 'border-muted-foreground'
                }`}
                >
                  {selectedCurriculo === curriculo.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <a
                  href={curriculo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-destructive hover:opacity-80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileText className="w-5 h-5" />
                </a>
                <span className="font-medium">{curriculo.nome}</span>
              </label>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Nenhum currículo cadastrado
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSelect} disabled={!selectedCurriculo}>
            Selecionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SelecionarCurriculo;
