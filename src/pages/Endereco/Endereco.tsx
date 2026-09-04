import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Pencil, Plus, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import api from '../../services/api';
import { Endereco } from '../../services/endpoints/endereco';
import EnderecoRegister from './EnderecoRegister';
import { Usuario } from '../../services/endpoints/auth';
import { handleApiError } from '../../lib/errors';

type EnderecoProps = {
  user: Usuario;
  isMe: boolean;
}

function MeuEndereco(props: EnderecoProps) {
  const { user, isMe } = props;
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoEdit, setEnderecoEdit] = useState<Endereco | null>(null);
  const [shouldReload, setShouldReload] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getEndereco() {
      try {
        const res = await api.endereco.getEndereco(user.id);
        setEnderecos(res.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar endereço');
      }
    }

    getEndereco();
  }, [shouldReload, user.id]);

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function handleClose() {
    setOpen(false);
    setEnderecoEdit(null);
    reload();
  }

  async function handleDelete(idEndereco: string) {
    try {
      await api.endereco.deletarEndereco(idEndereco);
      toast.success('Endereço deletado com sucesso');
      reload();
    } catch (err) {
      handleApiError(err, 'Erro ao deletar endereço');
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Endereços</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {enderecos && enderecos.length > 0 ? (
          enderecos.map((endereco: Endereco, index: number) => (
            <div
              key={endereco.id || index}
              className="p-4 border rounded-lg bg-card space-y-3"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h4 className="font-semibold">
                  Endereço
                  {index + 1}
                </h4>
              </div>

              <div className="text-sm space-y-1 pl-6">
                <p>
                  <span className="font-medium">Rua:</span>
                  {' '}
                  {endereco.rua}
                </p>
                <p>
                  <span className="font-medium">Número:</span>
                  {' '}
                  {endereco.numeroCasa}
                </p>
                <p>
                  <span className="font-medium">Bairro:</span>
                  {' '}
                  {endereco.bairro}
                </p>
                <p>
                  <span className="font-medium">Cidade:</span>
                  {' '}
                  {endereco.cidade}
                </p>
                <p>
                  <span className="font-medium">Estado:</span>
                  {' '}
                  {endereco.estado}
                </p>
                <p>
                  <span className="font-medium">CEP:</span>
                  {' '}
                  {endereco.cep}
                </p>
              </div>

              {isMe && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEnderecoEdit(endereco);
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
                    onClick={() => handleDelete(endereco.id!)}
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
            Nenhum endereço encontrado
          </p>
        )}

        {isMe && (
          <Button onClick={() => setOpen(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar endereço
          </Button>
        )}

        <EnderecoRegister
          isOpen={open}
          setOpen={setOpen}
          enderecoEdit={enderecoEdit!}
          handleClose={handleClose}
        />
      </CardContent>
    </Card>
  );
}

export default MeuEndereco;
