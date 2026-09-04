import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trash2, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { PerfilEndpoint } from '../../services/endpoints/perfil';
import api from '../../services/api';
import { handleApiError } from '../../lib/errors';

type UploadFormProps = {
  handleClose: () => void;
}

function UploadCurriculoForm({ handleClose }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [nome, setNome] = useState('');
  const perfilEndpoint = new PerfilEndpoint();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Por favor, selecione um currículo para enviar.');
      return;
    }
    if (!nome.trim()) {
      toast.warning('Informe um nome para o currículo.');
      return;
    }

    try {
      await perfilEndpoint.uploadCurriculo(file, nome.trim());
      toast.success('Currículo enviado com sucesso!');
      handleClose();
    } catch (error) {
      handleApiError(error, 'Erro ao fazer upload do currículo. Tente novamente.');
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="nomeCurriculo">Nome do currículo</Label>
        <Input
          id="nomeCurriculo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Currículo 2024"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="arquivoCurriculo">Arquivo</Label>
        <Input
          id="arquivoCurriculo"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
      </div>
      <Button onClick={handleUpload} className="w-full">
        Adicionar Currículo
      </Button>
    </div>
  );
}

function Curriculo({ isMe }: { isMe: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curriculos, setCurriculos] = useState<Array<{ id: string, nome: string, url: string }>>([]);
  const [shouldUpdate, setShouldUpdate] = useState(0);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShouldUpdate((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    try {
      toast.success('Currículo excluído com sucesso!');
      setCurriculos((prev) => prev.filter((curriculo) => curriculo.id !== id));
    } catch (error) {
      handleApiError(error, 'Erro ao excluir currículo');
    }
  };

  useEffect(() => {
    async function fetchCurriculos() {
      try {
        const res = await api.perfil.getCurriculos();
        setCurriculos(res.data.data);
      } catch (error) {
        handleApiError(error, 'Erro ao buscar currículos');
      }
    }

    fetchCurriculos();
  }, [shouldUpdate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Currículos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {curriculos.map((curriculo) => (
            <div
              key={curriculo.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <a
                href={curriculo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <FileText className="w-4 h-4" />
                {curriculo.nome}
              </a>
              {isMe && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(curriculo.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {isMe && (
          <Button onClick={() => setIsModalOpen(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Enviar novo currículo
          </Button>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Currículo</DialogTitle>
            </DialogHeader>
            <UploadCurriculoForm handleClose={handleCloseModal} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default Curriculo;
