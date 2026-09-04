import { useMemo, useState } from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import DeleteHandler from './DeleteHandler';
import useVaga from '../../hooks/useVaga';
import VagaModal from '../Home/components/VagaModal';
import useUniversidade from '../../hooks/useUniversidade';
import UniversidadeModal from './components/UniversidadeModal';
import useCompetencia from '../../hooks/useCompetencia';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui/table';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card } from '../../components/ui/card';

const vagaColumnsBase = [
  { field: 'titulo', headerName: 'Título' },
  { field: 'descricao', headerName: 'Descrição' },
  { field: 'localDaVaga', headerName: 'Local' },
  { field: 'aceitaRemoto', headerName: 'Remoto' },
  { field: 'dataLimiteCandidatura', headerName: 'Data limite' },
  { field: 'iniciante', headerName: 'Iniciante' },
];

const universidadeColumnsBase = [
  { field: 'nomeInstituicao', headerName: 'Nome da Instituição' },
  { field: 'sigla', headerName: 'Sigla' },
  { field: 'categoriaIes', headerName: 'Categoria IES' },
  { field: 'organizacaoAcademica', headerName: 'Organização Acadêmica' },
  { field: 'municipio', headerName: 'Município' },
  { field: 'uf', headerName: 'UF' },
  { field: 'situacaoIes', headerName: 'Situação IES' },
];

const competenciaColumnsBase = [
  { field: 'id', headerName: 'ID' },
  { field: 'descricao', headerName: 'Descrição' },
];

type AdminDatagridProps = {
  type: 'vaga' | 'universidade' | 'competencia';
};

function AdminDatagrid({ type }: AdminDatagridProps) {
  const { vagas, reloadVagas, isLoading: vagaLoading } = useVaga();
  const { universidades, reloadUniversidades, isLoading: universidadeLoading } =
    useUniversidade();
  const { competencias, reloadCompetencias, isLoading: competenciaLoading } =
    useCompetencia();

  const [editItem, setEditItem] = useState<any>(null);
  const [isEditVagaOpen, setIsEditVagaOpen] = useState(false);
  const [isEditUniversidadeOpen, setIsEditUniversidadeOpen] = useState(false);

  const isLoading = vagaLoading || universidadeLoading || competenciaLoading;

  const handleVagaDeleteRow = (id: string | number) =>
    DeleteHandler({ reload: reloadVagas, type: 'vaga', id });

  const handleUniversidadeDeleteRow = (id: string | number) =>
    DeleteHandler({ reload: reloadUniversidades, type: 'universidade', id });

  const handleCompetenciaDeleteRow = (id: string | number) =>
    DeleteHandler({ reload: reloadCompetencias, type: 'competencia', id });

  const rowsMap = useMemo(() => ({
    vaga: vagas ?? [],
    universidade: universidades ?? [],
    competencia: competencias ?? [],
  }), [vagas, universidades, competencias]);

  const columnsMap = useMemo(() => ({
    vaga: vagaColumnsBase,
    universidade: universidadeColumnsBase,
    competencia: competenciaColumnsBase,
  }), []);

  const handleDeleteRow = (id: string | number) => {
    if (type === 'vaga') handleVagaDeleteRow(id);
    else if (type === 'universidade') handleUniversidadeDeleteRow(id);
    else if (type === 'competencia') handleCompetenciaDeleteRow(id);
  };

  const handleEditRow = (row: any) => {
    setEditItem(row);
    if (type === 'universidade') {
      setIsEditUniversidadeOpen(true);
    } else if (type === 'vaga') {
      setIsEditVagaOpen(true);
    }
  };

  const canEdit = type === 'universidade';
  const columns = columnsMap[type];
  const rows = rowsMap[type];

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (Array.isArray(value)) return value.map((v: any) => v.descricao || v).join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (isLoading) {
    return (
      <Card className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Carregando...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[60vh]">
      <ScrollArea className="h-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.field}>{col.headerName}</TableHead>
              ))}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  Nenhum item encontrado
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row: any, index: number) => (
                <TableRow key={row.id || index} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                  {columns.map((col) => (
                    <TableCell key={col.field} className="max-w-[200px] truncate">
                      {formatCellValue(row[col.field])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRow(row)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Modals */}
      <VagaModal
        isOpen={isEditVagaOpen}
        handleClose={() => {
          setIsEditVagaOpen(false);
          reloadVagas();
        }}
        editObj={editItem}
      />
      <UniversidadeModal
        isOpen={isEditUniversidadeOpen}
        handleClose={() => {
          setIsEditUniversidadeOpen(false);
          reloadUniversidades();
        }}
        editObj={editItem}
      />
    </Card>
  );
}

export default AdminDatagrid;
