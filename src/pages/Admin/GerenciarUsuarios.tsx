import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Trash2, Loader2, Search, Users } from 'lucide-react'
import api from '../../services/api'
import { UsuarioFilter } from '../../services/endpoints/usuario'
import { useAuth } from '../../contexts/AuthContext'
import { handleApiError } from '../../lib/errors'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar'
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

function GerenciarUsuarios() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState<UsuarioFilter[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  async function carregar() {
    setLoading(true)
    try {
      const res = await api.usuario.filtrarUsuarios('')
      setUsuarios(res.data.data || [])
    } catch (err) {
      handleApiError(err, 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function handleExcluir(u: UsuarioFilter) {
    if (u.id === user?.id) {
      toast.warning('Você não pode excluir a si mesmo.')
      return
    }
    if (!window.confirm(`Excluir o usuário "${u.nome}"? A conta será desativada.`)) return
    try {
      await api.usuario.inativarUsuario(u.id)
      toast.success('Usuário excluído')
      setUsuarios((prev) => prev.filter((x) => x.id !== u.id))
    } catch (err) {
      handleApiError(err, 'Erro ao excluir usuário')
    }
  }

  const filtrados = usuarios.filter(
    (u) => u.nome?.toLowerCase().includes(busca.toLowerCase())
      || u.email?.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
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
        <EmptyState icon={Users} title="Nenhum usuário encontrado" description="Não há usuários para este filtro." />
      ) : (
        <Card>
          <ScrollArea className="h-[55vh]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Usuário</TableHead>
                  <TableHead className="hidden sm:table-cell">E-mail</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={u.fotoPerfil || undefined} alt={u.nome} />
                          <AvatarFallback>{u.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <Link to={`/usuario/${u.userUrl}`} className="font-medium hover:underline block truncate">
                            {u.nome}
                          </Link>
                          <span className="text-xs text-muted-foreground sm:hidden truncate block">{u.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExcluir(u)}
                        disabled={u.id === user?.id}
                        title={u.id === user?.id ? 'Você não pode se excluir' : 'Excluir usuário'}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

export default GerenciarUsuarios
