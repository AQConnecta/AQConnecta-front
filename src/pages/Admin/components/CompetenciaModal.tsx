import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../services/api';
import { handleApiError } from '../../../lib/errors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';

type CompetenciaModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

type Competencia = {
  id: string;
  descricao: string;
};

const competenciaDefaultValues: Competencia = {
  id: '',
  descricao: '',
};

function CompetenciaModal(props: CompetenciaModalProps) {
  const { isOpen, handleClose } = props;
  const [competencia, setCompetencia] = useState<Competencia>(competenciaDefaultValues);

  function setCompetenciaValue(value: string | number, field: string) {
    setCompetencia({ ...competencia, [field]: value });
  }

  function clearFields() {
    setCompetencia(competenciaDefaultValues);
  }

  function onClose() {
    clearFields();
    handleClose();
  }

  async function handleSubmit() {
    try {
      await api.competencia.cadastrarCompetencia({ ...competencia });
      toast.success('Competência criada com sucesso');
      onClose();
    } catch (error) {
      handleApiError(error, 'Erro ao criar competência');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Nova Competência
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

        <div className="flex flex-col gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição da competência</Label>
            <Input
              id="descricao"
              value={competencia.descricao}
              onChange={(e) => setCompetenciaValue(e.target.value, 'descricao')}
              placeholder="Digite a descrição da competência"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CompetenciaModal;
