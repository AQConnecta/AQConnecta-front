import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { X, FileText, Loader2, Paperclip, GraduationCap, Search } from 'lucide-react';
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';
import { FormacaoAcademica, Universidade } from '../../services/endpoints/formacaoAcademica';
import { handleApiError } from '../../lib/errors';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';

interface IModal {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  handleClose: () => void;
  editObj?: FormacaoAcademica | null;
}

const defaultValues: FormacaoAcademica = {
  universidade: {
    id: '',
    codigoIes: 0,
    nomeInstituicao: '',
    sigla: '',
    categoriaIes: '',
    organizacaoAcademica: '',
    codigoMunicipioIbge: '',
    municipio: '',
    uf: '',
    situacaoIes: '',
  },
  descricao: '',
  diploma: '',
  dataInicio: '',
  dataFim: '',
  atualFormacao: false,
};

function FormacaoAcademicaRegister({ isOpen, setOpen, handleClose: closeModal, editObj }: IModal) {
  const [formacaoAcademica, setFormacaoAcademica] = useState<FormacaoAcademica>(() => {
    if (editObj) {
      return {
        ...editObj,
        dataInicio: editObj.dataInicio,
        dataFim: editObj.dataFim,
      };
    }
    return defaultValues;
  });
  const [universidades, setUniversidades] = useState<Universidade[]>([]);
  const [searchUniversidade, setSearchUniversidade] = useState('');
  const [buscandoUniversidades, setBuscandoUniversidades] = useState(false);
  const [enviandoDiploma, setEnviandoDiploma] = useState(false);
  const diplomaInputRef = useRef<HTMLInputElement>(null);
  const { id: formacaoId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isEdit = !!formacaoId;
  const uniSelecionada = formacaoAcademica.universidade && formacaoAcademica.universidade.id
    ? formacaoAcademica.universidade
    : null;

  function handleClose() {
    setFormacaoAcademica(defaultValues);
    setSearchUniversidade('');
    closeModal();
  }

  async function submitFormacao() {
    const newFormacao = {
      ...formacaoAcademica,
      dataInicio: `${formacaoAcademica.dataInicio}T00:00:00`,
      dataFim: formacaoAcademica.dataFim ? `${formacaoAcademica.dataFim}T00:00:00` : formacaoAcademica.dataFim,
    };
    if (isEdit) {
      try {
        if (!formacaoAcademica.id) return;
        await api.formacaoAcademica.alterarFormacaoAcademica(formacaoAcademica.id, newFormacao);
        toast.success('Formação acadêmica editada com sucesso');
        handleClose();
      } catch (error) {
        handleApiError(error, 'Erro ao editar formação acadêmica');
      }
      return;
    }
    try {
      await api.formacaoAcademica.cadastrarFormacaoAcademica(newFormacao);
      toast.success('Formação acadêmica cadastrada com sucesso');
      handleClose();
    } catch (error) {
      handleApiError(error, 'Erro ao cadastrar formação acadêmica');
    }
  }

  useEffect(() => {
    async function getFormacao() {
      try {
        if (!formacaoId || !user) return;
        const res = await api.formacaoAcademica.localizaFormacaoAcademica(formacaoId);
        const formacao = res.data.data;
        formacao.dataInicio = formacao.dataInicio.split('T')[0];
        if (formacao.dataFim) formacao.dataFim = formacao.dataFim.split('T')[0];
        setFormacaoAcademica(formacao);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar formação acadêmica');
      }
    }
    getFormacao();
  }, [formacaoId]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setBuscandoUniversidades(true);
    const timer = setTimeout(() => {
      api.universidade
        .getUniversidade(searchUniversidade.trim(), 0, 20)
        .then((res) => {
          if (active) setUniversidades(res.data.data || []);
        })
        .catch(() => {
          if (active) setUniversidades([]);
        })
        .finally(() => {
          if (active) setBuscandoUniversidades(false);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchUniversidade, isOpen]);

  function validateFields() {
    const {
      descricao, dataInicio, dataFim,
    } = formacaoAcademica;
    if (formacaoAcademica.atualFormacao) {
      return !(uniSelecionada && descricao && dataInicio);
    }
    return !(uniSelecionada && descricao && dataInicio && dataFim);
  }

  const handleKeyPress = useHandleKeyPress({
    verification: validateFields(),
    key: 'Enter',
    callback: () => submitFormacao(),
  });

  function setFormacaoValue(value: any, field: string) {
    setFormacaoAcademica({ ...formacaoAcademica, [field]: value });
  }

  async function handleDiplomaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnviandoDiploma(true);
    try {
      const res = await api.formacaoAcademica.uploadDiploma(file);
      setFormacaoValue(res.data.data, 'diploma');
      toast.success('Diploma anexado com sucesso');
    } catch (err) {
      handleApiError(err, 'Erro ao anexar diploma');
    } finally {
      setEnviandoDiploma(false);
      if (diplomaInputRef.current) diplomaInputRef.current.value = '';
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {isEdit ? 'Editar' : 'Adicionar'} formação acadêmica
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4 -mr-4">
          <div className="flex flex-col gap-5 py-1">
            <div className="space-y-2">
              <Label>
                Instituição de ensino <span className="text-destructive">*</span>
              </Label>
              <Select
                value={uniSelecionada?.id || ''}
                onValueChange={(value) => {
                  const selected = universidades.find((u) => u.id === value);
                  if (selected) setFormacaoValue(selected, 'universidade');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a instituição">
                    {uniSelecionada
                      ? `${uniSelecionada.nomeInstituicao}${uniSelecionada.sigla ? ` (${uniSelecionada.sigla})` : ''}`
                      : 'Selecione a instituição'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 sticky top-0 bg-popover z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou sigla..."
                        value={searchUniversidade}
                        onChange={(e) => setSearchUniversidade(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        onKeyDownCapture={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="pl-8"
                        autoFocus
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-56">
                    {buscandoUniversidades ? (
                      <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Buscando...
                      </div>
                    ) : universidades.length === 0 ? (
                      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        {searchUniversidade.trim()
                          ? 'Nenhuma instituição encontrada para esta busca.'
                          : 'Digite para buscar uma instituição.'}
                      </div>
                    ) : (
                      universidades.map((universidade) => (
                        <SelectItem key={universidade.id} value={universidade.id || ''}>
                          <span className="font-medium">{universidade.nomeInstituicao}</span>
                          {universidade.sigla && (
                            <span className="text-muted-foreground"> ({universidade.sigla})</span>
                          )}
                          {universidade.uf && (
                            <span className="text-muted-foreground"> · {universidade.uf}</span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">
                Curso / formação <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descricao"
                placeholder="Ex.: Bacharelado em Ciência da Computação"
                rows={3}
                value={formacaoAcademica.descricao}
                onChange={(e) => setFormacaoValue(e.target.value, 'descricao')}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="atualFormacao" className="cursor-pointer">
                  Estou cursando atualmente
                </Label>
                <p className="text-xs text-muted-foreground">A data de fim fica desabilitada</p>
              </div>
              <Switch
                id="atualFormacao"
                checked={formacaoAcademica.atualFormacao}
                onCheckedChange={(checked) => setFormacaoValue(checked, 'atualFormacao')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">
                  Início <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formacaoAcademica.dataInicio || ''}
                  onChange={(e) => setFormacaoValue(e.target.value, 'dataInicio')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">
                  Conclusão {!formacaoAcademica.atualFormacao && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  disabled={formacaoAcademica.atualFormacao}
                  value={formacaoAcademica.dataFim || ''}
                  onChange={(e) => setFormacaoValue(e.target.value, 'dataFim')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diploma / certificado</Label>
              <input
                ref={diplomaInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleDiplomaChange}
              />
              {formacaoAcademica.diploma ? (
                <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={formacaoAcademica.diploma}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 truncate text-sm text-primary hover:underline"
                  >
                    Diploma anexado
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setFormacaoValue('', 'diploma')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={enviandoDiploma}
                  onClick={() => diplomaInputRef.current?.click()}
                >
                  {enviandoDiploma ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Paperclip className="mr-2 h-4 w-4" />
                      Anexar diploma (PDF ou imagem)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={validateFields() || enviandoDiploma} onClick={() => submitFormacao()}>
            {isEdit ? 'Salvar alterações' : 'Adicionar formação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FormacaoAcademicaRegister;
