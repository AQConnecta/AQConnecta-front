import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, MoreVertical, Pencil, Trash2, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { Vaga } from '../services/endpoints/vaga';
import { Usuario } from '../services/endpoints/auth';
import api from '../services/api';
import { handleApiError } from '../lib/errors';
import { useJaCandidatado, marcarCandidatado } from '../hooks/useCandidaturas';
import { useRequireAuth } from '../hooks/useRequireAuth';
import VagaModal from '../pages/Home/components/VagaModal';
import CandidatosModal from './CandidatosModal';
import SelecionarCurriculo from '../pages/Home/components/SelecionarCurriculo';

type VagaProps = {
  vaga: Vaga;
  reloadVagas: () => void;
  hideButton?: boolean;
}

function getPublicador(publicador: string | Usuario): Usuario | null {
  if (typeof publicador === 'string') {
    return null;
  }
  return publicador;
}

function VagaCard(props: VagaProps) {
  const { vaga, reloadVagas, hideButton } = props;
  const [isOpenEditVaga, setIsOpenEditVaga] = useState(false);
  const [isOpenCandidatos, setIsOpenCandidatos] = useState(false);
  const [editObj, seteditObj] = useState<Vaga | null>(null);
  const [isCurriculoModalOpen, setIsCurriculoModalOpen] = useState(false);
  const [vagaToApply, setVagaToApply] = useState<Vaga | null>(null);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const { user } = useAuth();

  const publicador = getPublicador(vaga.publicador);
  const createdByMe = publicador?.id === user?.id;
  const isExpired = new Date(vaga.dataLimiteCandidatura) < new Date();
  const jaCandidatado = useJaCandidatado(vaga.id, user?.id);
  const requireAuth = useRequireAuth();

  function handleOpenCurriculoModal(vagaSelected: Vaga) {
    setVagaToApply(vagaSelected);
    setIsCurriculoModalOpen(true);
  }

  function handleOpenCandidatos(vagaSelected: Vaga) {
    setSelectedVaga(vagaSelected);
    setIsOpenCandidatos(true);
  }

  async function handleEdit(vagaSelected: Vaga) {
    setIsOpenEditVaga(true);
    seteditObj(vagaSelected);
  }

  async function handleSelectCurriculo(curriculoId: string) {
    if (vagaToApply) {
      try {
        await api.vaga.candidatarVaga(vagaToApply.id!, curriculoId);
        toast.success('Candidatura realizada com sucesso');
        marcarCandidatado(vagaToApply.id!);
        setIsCurriculoModalOpen(false);
      } catch (err) {
        handleApiError(err, 'Erro ao se candidatar');
      }
    }
  }

  async function handleDelete(vagaSelected: Vaga) {
    try {
      await api.vaga.deletarVaga(vagaSelected.id!);
      reloadVagas();
      toast.success('Vaga excluída com sucesso');
    } catch (err) {
      handleApiError(err, 'Erro ao excluir a vaga');
    }
  }

  function handleCloseEditModal() {
    reloadVagas();
    setIsOpenEditVaga(false);
  }

  return (
    <>
      {isOpenEditVaga && (
        <VagaModal isOpen={isOpenEditVaga} handleClose={() => handleCloseEditModal()} editObj={editObj} />
      )}
      {isOpenCandidatos && (
        <CandidatosModal onClose={() => setIsOpenCandidatos(false)} selectedVaga={selectedVaga} />
      )}
      {isCurriculoModalOpen && (
        <SelecionarCurriculo
          isOpen={isCurriculoModalOpen}
          handleClose={() => setIsCurriculoModalOpen(false)}
          onSelect={handleSelectCurriculo}
        />
      )}

      <Card className="w-full max-w-[600px] hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-foreground break-words flex-1">
              {vaga.titulo}
            </h3>
            {createdByMe && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(vaga)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(vaga)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Link to={`/usuario/${publicador?.userUrl || ''}`} target="_blank">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={publicador?.fotoPerfil} alt="Foto de perfil" />
                  <AvatarFallback>
                    {publicador?.nome?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <span className="text-sm text-muted-foreground">
                Criado por
                {' '}
                {createdByMe ? 'você' : (publicador?.nome || 'Desconhecido')}
              </span>
            </div>
            {isExpired && (
              <Badge variant="destructive">Vaga expirada</Badge>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{vaga.localDaVaga}</span>
            </div>
            <Badge variant={vaga.aceitaRemoto ? 'info' : 'warning'}>
              <Briefcase className="w-3 h-3 mr-1" />
              {vaga.aceitaRemoto ? 'Vaga remota' : 'Vaga presencial'}
            </Badge>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-semibold text-foreground">Sobre a vaga</h4>
              {vaga.iniciante && (
                <Badge variant="success">Iniciante</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {vaga.descricao}
            </p>
          </div>

          {vaga.competencias && vaga.competencias.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Competências</h4>
              <div className="flex flex-wrap gap-2">
                {vaga.competencias.map((competencia) => (
                  <Badge
                    key={competencia.id}
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {competencia.descricao}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="pt-4 flex justify-between items-center flex-wrap gap-2">
          {createdByMe ? (
            <Button
              variant="link"
              onClick={() => handleOpenCandidatos(vaga)}
              className="p-0 h-auto text-primary"
            >
              <Users className="w-4 h-4 mr-1" />
              Ver candidatos
            </Button>
          ) : jaCandidatado ? (
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Candidatura enviada
            </span>
          ) : (
            <div />
          )}
          {!(hideButton || createdByMe || jaCandidatado) && (
            <Button onClick={() => requireAuth(() => handleOpenCurriculoModal(vaga))}>
              Quero me candidatar
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

export default VagaCard;
