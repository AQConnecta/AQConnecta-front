import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useHandleKeyPress from '../../hooks/useHandleKeyPress';
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { handleApiError } from '../../lib/errors';

interface IModal {
  experienciaEdit?: Experiencia;
  handleClose: () => void;
}

function ExperienciaRegister({ experienciaEdit, handleClose }: IModal) {
  const [experiencia, setExperiencia] = useState<Experiencia>(experienciaEdit || {
    titulo: '',
    instituicao: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    atualExperiencia: false,
  });
  const isEdit = !!experienciaEdit;

  async function submitExperiencia() {
    const newExperiencia = {
      ...experiencia,
      dataInicio: `${experiencia.dataInicio}T00:00:00`,
      dataFim: experiencia.dataFim ? `${experiencia.dataFim}T00:00:00` : experiencia.dataFim
    };
    if (isEdit) {
      try {
        if (!experiencia.id) return;
        await api.experiencia.alterarExperiencia(experiencia.id, newExperiencia);
        toast.success('Experiência editada com sucesso');
        handleClose();
      } catch (error) {
        handleApiError(error, 'Erro ao editar experiência');
      }
      return;
    }
    try {
      await api.experiencia.cadastrarExperiencia(newExperiencia);
      toast.success('Experiência adicionada com sucesso');
      handleClose();
    } catch (error) {
      handleApiError(error, 'Erro ao adicionar experiência');
    }
  }

  function validateFields() {
    const {
      titulo, instituicao, dataInicio, dataFim, descricao,
    } = experiencia;
    if (experiencia.atualExperiencia) {
      return !(titulo && instituicao && dataInicio && descricao);
    }
    return !(titulo && instituicao && dataInicio && dataFim && descricao);
  }

  const handleKeyPress = useHandleKeyPress({
    verification: validateFields(),
    key: 'Enter',
    callback: () => submitExperiencia(),
  });

  function setExperienciaValue(value: string | boolean, field: string) {
    setExperiencia({ ...experiencia, [field]: value });
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="w-full flex flex-col gap-4 bg-background pt-2">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          placeholder="Título da experiência"
          value={experiencia.titulo}
          onChange={(e) => setExperienciaValue(e.target.value, 'titulo')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instituicao">Instituição</Label>
        <Input
          id="instituicao"
          placeholder="Instituição"
          value={experiencia.instituicao}
          onChange={(e) => setExperienciaValue(e.target.value, 'instituicao')}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-end gap-2 pr-1 pb-2">
          <Switch
            id="atualExperiencia"
            checked={experiencia.atualExperiencia}
            onCheckedChange={(checked) => setExperienciaValue(checked, 'atualExperiencia')}
          />
          <Label htmlFor="atualExperiencia" className="cursor-pointer">
            Experiência atual
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data de início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={experiencia.dataInicio || ''}
              onChange={(e) => setExperienciaValue(e.target.value, 'dataInicio')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data de fim</Label>
            <Input
              id="dataFim"
              type="date"
              disabled={experiencia.atualExperiencia}
              value={experiencia.dataFim || ''}
              onChange={(e) => setExperienciaValue(e.target.value, 'dataFim')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          placeholder="Descrição"
          rows={4}
          value={experiencia.descricao}
          onChange={(e) => setExperienciaValue(e.target.value, 'descricao')}
        />
      </div>

      <Button
        className="w-full h-12"
        disabled={validateFields()}
        onClick={() => submitExperiencia()}
      >
        {isEdit ? 'Salvar' : 'Adicionar'}
      </Button>
    </div>
  );
}

export default ExperienciaRegister;
