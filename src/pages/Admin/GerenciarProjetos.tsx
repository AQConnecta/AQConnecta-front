import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Trash2, Loader2, Search, FolderKanban, ExternalLink } from 'lucide-react'
import api from '../../services/api'
import { ProjetoResumo, STATUS_LABELS, statusVariant } from '../../services/endpoints/projeto'
import { handleApiError } from '../../lib/errors'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Card } from '../../components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../components/ui/table'
import { ScrollArea } from '../../components/ui/scroll-area'
import EmptyState from '../../components/EmptyState'

function GerenciarProjetos() {
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  async function carregar() {
    setLoading(true)
    try {
      const res = await api.projeto.listar({})
      setProjetos(res.data.data || [])
    } catch (err) {
      handleApiError(err, 'Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleExcluir(p: ProjetoResumo) {
    if (!window.confirm(`Excluir o projeto "${p.titulo}"? Esta ação não pode ser desfeita.`)) return
    try {
      await api.projeto.deletar(p.id)
      toast.success('Projeto excluído')
      setProjetos((prev) => prev.filter((x) => x.id !== p.id))
    } catch (err) {
      handleApiError(err, 'Erro ao excluir projeto')
    }
  }

  const filtrados = projetos.filter((p) => p.titulo?.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <Card className="h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      ) : filtrados.length === 0 ? (
        <EmptyState icon={FolderKanban} title="Nenhum projeto encontrado" description="Não há projetos para este filtro." />
      ) : (
        <Card>
          <ScrollArea className="h-[55vh]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Projeto</TableHead>
                  <TableHead className="hidden sm:table-cell">Dono</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="font-medium block truncate max-w-[240px]">{p.titulo}</span>
                      {p.area && <span className="text-xs text-muted-foreground">{p.area.descricao}</span>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{p.donoNome}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={statusVariant(p.status)}>{STATUS_LABELS[p.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild title="Ver projeto">
                          <Link to={`/projetos/${p.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleExcluir(p)} title="Excluir projeto">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </div>
  )
}

export default GerenciarProjetos
