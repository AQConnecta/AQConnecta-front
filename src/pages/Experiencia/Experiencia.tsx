import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Pencil, Plus, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import api from '../../services/api';
import { Experiencia } from '../../services/endpoints/experiencia';
import ExperienciaRegister from './ExperienciaRegister';
import { Usuario } from '../../services/endpoints/auth';
import CustomDialog from '../../components/CustomDialog';
import { handleApiError } from '../../lib/errors';

type ExperienciaProps = {
  user: Usuario;
  isMe: boolean;
};

function MinhaExperiencia(props: ExperienciaProps) {
  const { user, isMe } = props;
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [experienciaToEdit, setExperienciaToEdit] = useState<Experiencia | null>(null);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getExperiencia() {
      try {
        const res = await api.experiencia.getExperiencia(user.id);
        setExperiencias(res.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar experiência');
      }
    }

    getExperiencia();
  }, [shouldReload, user.id]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function handleClose() {
    setOpen(false);
    setExperienciaToEdit(null);
    reload();
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  async function handleDelete(idExperiencia: string) {
    try {
      await api.experiencia.deletarExperiencia(idExperiencia);
      toast.success('Experiência deletada com sucesso');
      reload();
    } catch (err) {
      handleApiError(err, 'Erro ao deletar experiência');
    }
  }

  async function handleEdit(experiencia: Experiencia) {
    setExperienciaToEdit(experiencia);
    setOpen(true);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Experiências</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiencias && experiencias.length > 0 ? (
          experiencias.map((experiencia, index) => (
            <div
              key={experiencia.id || index}
              className="p-4 border rounded-lg bg-card space-y-3"
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <h4 className="font-semibold uppercase">
                  {experiencia.titulo} - {experiencia.instituicao}
                </h4>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {formatDate(experiencia.dataInicio)} - {' '}
                {experiencia.atualExperiencia ? 'até o momento' : formatDate(experiencia.dataFim)}
              </p>
              
              <p className="text-sm">{experiencia.descricao}</p>

              {isMe && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(experiencia)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(experiencia.id!)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Sem experiências até o momento
          </p>
        )}

        {isMe && (
          <Button onClick={() => setOpen(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar experiência
          </Button>
        )}

        <CustomDialog 
          isOpen={open} 
          onClose={() => setOpen(false)} 
          title={`${experienciaToEdit ? 'Editar' : 'Adicionar'} experiência`}
        >
          <ExperienciaRegister experienciaEdit={experienciaToEdit!} handleClose={handleClose} />
        </CustomDialog>
      </CardContent>
    </Card>
  );
}

export default MinhaExperiencia;
