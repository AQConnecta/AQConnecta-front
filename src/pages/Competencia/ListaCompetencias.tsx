import { useEffect, useState } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import { Competencia } from '../../services/endpoints/competencia';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui/table';
import { handleApiError } from '../../lib/errors';

function ListCompetencia() {
  const [rows, setRows] = useState<Competencia[]>([]);
  const [minhasCompetencias, setMinhasCompetencias] = useState<Competencia[]>([]);
  const [shouldReload, setShouldReload] = useState(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedMyComp, setSelectedMyComp] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  function reload() {
    setShouldReload((prev) => prev + 1);
  }

  function toggleSelection(id: string, selection: string[], setSelection: (ids: string[]) => void) {
    if (selection.includes(id)) {
      setSelection(selection.filter((s) => s !== id));
    } else {
      setSelection([...selection, id]);
    }
  }

  async function handleLinkWithMe() {
    try {
      const competencias = selectedRows.map((id) => ({ id }));
      await api.competencia.linkCompetenciaToMe({ competencias });
      toast.success('Competências vinculadas com sucesso');
      setSelectedRows([]);
      reload();
    } catch (error) {
      handleApiError(error, 'Erro ao vincular competências');
    }
  }

  async function handleUnlink() {
    try {
      const competencias = selectedMyComp.map((id) => ({ id }));
      await api.competencia.removeCompetenciaFromMe({ competencias });
      toast.success('Competências desvinculadas com sucesso');
      setSelectedMyComp([]);
      reload();
    } catch (error) {
      handleApiError(error, 'Erro ao desvincular competências');
    }
  }

  useEffect(() => {
    async function getCompetencias() {
      try {
        setIsLoading(true);
        const res = await api.competencia.listAll();
        setRows(res.data.data || []);
      } catch (error) {
        handleApiError(error, 'Erro ao buscar competências');
      } finally {
        setIsLoading(false);
      }
    }

    async function getMyCompetencias() {
      try {
        const res = await api.competencia.listByUserId(user?.id!);
        setMinhasCompetencias(res.data.data || []);
      } catch (error) {
        handleApiError(error, 'Erro ao buscar minhas competências');
      }
    }

    getCompetencias();
    getMyCompetencias();
  }, [shouldReload, user?.id]);

  return (
    <div className="h-full w-full flex items-center justify-center flex-col p-6">
      <div className="w-full max-w-4xl flex items-center justify-center p-4">
        <Button onClick={reload} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de todas as competências */}
        <Card className="h-[400px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Lista de Competências</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-80px)]">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                            Nenhuma competência encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedRows.includes(row.id!)}
                                onCheckedChange={() => toggleSelection(row.id!, selectedRows, setSelectedRows)}
                              />
                            </TableCell>
                            <TableCell>{row.descricao}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <Button
                  className="mt-3"
                  disabled={selectedRows.length === 0}
                  onClick={handleLinkWithMe}
                >
                  Vincular a mim ({selectedRows.length})
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Minhas competências */}
        <Card className="h-[400px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Minhas Competências</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-80px)]">
            <ScrollArea className="flex-1 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {minhasCompetencias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                        Nenhuma competência vinculada
                      </TableCell>
                    </TableRow>
                  ) : (
                    minhasCompetencias.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedMyComp.includes(row.id!)}
                            onCheckedChange={() => toggleSelection(row.id!, selectedMyComp, setSelectedMyComp)}
                          />
                        </TableCell>
                        <TableCell>{row.descricao}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <Button
              className="mt-3"
              variant="destructive"
              disabled={selectedMyComp.length === 0}
              onClick={handleUnlink}
            >
              Desvincular ({selectedMyComp.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ListCompetencia;
