import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../services/api';
import { PartialUniversidade, Universidade } from '../../../services/endpoints/formacaoAcademica';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { ScrollArea } from '../../../components/ui/scroll-area';

type UniversidadeModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  editObj?: Universidade | null;
};

const universidadeDefaultValues: PartialUniversidade = {
  codigoIes: 0,
  nomeInstituicao: '',
  sigla: '',
  categoriaIes: '',
  organizacaoAcademica: '',
  codigoMunicipioIbge: '',
  municipio: '',
  uf: '',
  situacaoIes: '',
};

const organizacaoAcademicaOptions = [
  'Faculdade',
  'Universidade',
  'Centro Universitário',
  'Instituto Federal de Educação, Ciência e Tecnologia',
  'Instituto Superior ou Escola Superior',
  'Escola de Governo',
  'Instituição Especialmente Credenciada para oferta de cursos lato sensu',
  'Centro Federal de Educação Tecnológica',
  'Faculdades Integradas',
  'Faculdade de Tecnologia',
];

const situacaoIesOptions = ['Ativa', 'Extinta'];

function UniversidadeModal(props: UniversidadeModalProps) {
  const { isOpen, handleClose, editObj } = props;
  const [universidade, setUniversidade] = useState<Universidade>(
    editObj || (universidadeDefaultValues as Universidade),
  );
  const isEdit = !!editObj;

  function setUniversidadeValue(value: string | number, field: string) {
    setUniversidade({ ...universidade, [field]: value });
  }

  function clearFields() {
    setUniversidade(universidadeDefaultValues as Universidade);
  }

  function onClose() {
    clearFields();
    handleClose();
  }

  async function handleSubmit() {
    try {
      if (isEdit) {
        await api.universidade.alterarUniversidade(editObj?.id!, { ...universidade });
        toast.success('Universidade editada com sucesso');
        onClose();
        return;
      }
      await api.universidade.cadastrarUniversidade({ ...universidade });
      toast.success('Universidade criada com sucesso');
      onClose();
    } catch (error) {
      handleApiError(error, 'Erro ao criar universidade');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEdit ? 'Editar universidade' : 'Nova universidade'}
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

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nomeInstituicao">Nome da Instituição</Label>
              <Input
                id="nomeInstituicao"
                value={universidade.nomeInstituicao}
                onChange={(e) => setUniversidadeValue(e.target.value, 'nomeInstituicao')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sigla">Sigla</Label>
              <Input
                id="sigla"
                value={universidade.sigla}
                onChange={(e) => setUniversidadeValue(e.target.value, 'sigla')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigoIes">Código IES</Label>
              <Input
                id="codigoIes"
                type="number"
                value={universidade.codigoIes}
                onChange={(e) => setUniversidadeValue(Number(e.target.value), 'codigoIes')}
              />
            </div>

            <div className="space-y-2">
              <Label>Organização Acadêmica</Label>
              <Select
                value={universidade.organizacaoAcademica}
                onValueChange={(value) => setUniversidadeValue(value, 'organizacaoAcademica')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {organizacaoAcademicaOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio">Município</Label>
              <Input
                id="municipio"
                value={universidade.municipio}
                onChange={(e) => setUniversidadeValue(e.target.value, 'municipio')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Input
                id="uf"
                value={universidade.uf}
                onChange={(e) => setUniversidadeValue(e.target.value, 'uf')}
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Situação IES</Label>
              <Select
                value={universidade.situacaoIes}
                onValueChange={(value) => setUniversidadeValue(value, 'situacaoIes')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {situacaoIesOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? 'Editar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UniversidadeModal;
