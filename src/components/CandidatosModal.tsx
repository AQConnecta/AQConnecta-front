import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { Vaga } from '../services/endpoints/vaga';
import api from '../services/api';
import { handleApiError } from '../lib/errors';

type CandidatoModalProps = {
  selectedVaga: { titulo: string; id?: string } | null;
  onClose: () => void;
}

function CandidatosModal(props: CandidatoModalProps) {
  const { onClose, selectedVaga } = props;
  const [candidatos, setCandidatos] = useState<Vaga[]>([]);

  useEffect(() => {
    async function getCandidatos(vaga: Vaga) {
      try {
        const res = await api.vaga.listarCandidatos(vaga.id!);
        setCandidatos(res.data.data);
      } catch (err) {
        handleApiError(err, 'Erro ao buscar candidatos');
      }
    }

    if (selectedVaga) {
      getCandidatos(selectedVaga as Vaga);
    }
  }, [selectedVaga]);

  return (
    <Dialog open={!!selectedVaga} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Candidatos para
            {' '}
            {selectedVaga?.titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {candidatos.length ? (
            candidatos.map((candidato, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={candidato.usuario?.fotoPerfil} alt={candidato.usuario?.nome} />
                    <AvatarFallback>
                      {candidato.usuario?.nome?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{candidato.usuario?.nome}</span>
                    {candidato.curriculoUrl && candidato.usuario && (
                      <Link
                        to={`/usuario/${candidato.usuario.userUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Ver perfil
                      </Link>
                    )}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(candidato.curriculoUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Baixar currículo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Nenhum candidato encontrado
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onClose()}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CandidatosModal;
