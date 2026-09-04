import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Pencil, Plus, GraduationCap, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import api from '../../services/api';
import { FormacaoAcademica } from '../../services/endpoints/formacaoAcademica';
import FormacaoAcademicaRegister from './FormacaoAcademicaRegister';
import { Usuario } from '../../services/endpoints/auth';
import { handleApiError } from '../../lib/errors';

type FormacaoAcademicaProps = {
  user: Usuario;
  isMe: boolean;
};

function MinhaFormacaoAcademica(props: FormacaoAcademicaProps) {
  const { user, isMe } = props;
  const [formacoesAcademicas, setFormacoesAcademicas] = useState<FormacaoAcademica[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [editObj, setEditObj] = useState<FormacaoAcademica | null>(null);

  useEffect(() => {
    async function getFormacaoAcademica() {
      try {
        const res = await api.formacaoAcademica.getFormacaoAcademica(user.id);
        setFormacoesAcademicas(res.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar formação');
      }
    }

    getFormacaoAcademica();
  }, [shouldReload, user.id]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function handleClose() {
    setOpen(false);
    setEditObj(null);
    reload();
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  async function handleDelete(idFormacaoAcademica: string) {
    try {
      await api.formacaoAcademica.deletarFormacaoAcademica(idFormacaoAcademica);
      toast.success('Formação Acadêmica deletada com sucesso');
      reload();
    } catch (err) {
      handleApiError(err, 'Erro ao deletar formação');
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formações Acadêmicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {formacoesAcademicas && formacoesAcademicas.length > 0 ? (
          formacoesAcademicas.map((formacaoAcademica, index) => (
            <div
              key={formacaoAcademica.id || index}
              className="p-4 border rounded-lg bg-card space-y-3"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Formação
                  {index + 1}
                </span>
              </div>

              <h4 className="font-semibold uppercase">
                {formacaoAcademica.descricao}
                {' '}
                -
                {formacaoAcademica.universidade.nomeInstituicao}
              </h4>

              <p className="text-sm text-muted-foreground">
                {formatDate(formacaoAcademica.dataInicio)}
                {' '}
                -
                {formatDate(formacaoAcademica.dataFim)}
                {formacaoAcademica.atualFormacao && ' - Cursando'}
              </p>

              {formacaoAcademica.diploma && (
                <a
                  href={formacaoAcademica.diploma}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  Ver diploma
                </a>
              )}

              <Separator />

              {isMe && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditObj(formacaoAcademica);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(formacaoAcademica.id!)}
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
            Sem formações até o momento
          </p>
        )}

        {isMe && (
          <Button onClick={() => setOpen(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar formação acadêmica
          </Button>
        )}

        <FormacaoAcademicaRegister
          isOpen={open}
          setOpen={setOpen}
          handleClose={handleClose}
          editObj={editObj}
        />
      </CardContent>
    </Card>
  );
}

export default MinhaFormacaoAcademica;
