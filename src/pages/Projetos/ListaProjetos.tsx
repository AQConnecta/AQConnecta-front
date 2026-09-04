import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Heart, Mail, Plus, Search } from 'lucide-react'
import api from '../../services/api'
import { ProjetoResumo, STATUS_LABELS, STATUS_OPTIONS } from '../../services/endpoints/projeto'
import { Area } from '../../services/endpoints/area'
import { handleApiError } from '../../lib/errors'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../contexts/AuthContext'
import EmptyState from '../../components/EmptyState'
import { CardSkeleton } from '../../components/LoadingState'
import ProjetoCard from '../../components/ProjetoCard'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

function ListaProjetos() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [titulo, setTitulo] = useState('')
  const [idArea, setIdArea] = useState('all')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    api.area.listAll().then((res) => setAreas(res.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      setLoading(true)
      api.projeto
        .listar({
          titulo: titulo || undefined,
          idArea: idArea === 'all' ? undefined : idArea,
          status: status === 'all' ? undefined : status,
        })
        .then((res) => {
          if (active) setProjetos(res.data.data || [])
        })
        .catch((err) => {
          if (active) handleApiError(err, 'Erro ao listar projetos')
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 350)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [titulo, idArea, status])

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        icon={FolderKanban}
        title="Projetos de extensão"
        description="Encontre projetos, siga e participe."
        actions={
          user ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/projetos/seguidos')}>
                <Heart className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Que sigo</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/projetos/convites')}>
                <Mail className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Meus convites</span>
              </Button>
              <Button size="sm" onClick={() => navigate('/projetos/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo projeto
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              Entrar para criar
            </Button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={idArea} onValueChange={setIdArea}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            {areas.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.descricao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : projetos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((p) => (
            <ProjetoCard key={p.id} projeto={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto encontrado"
          description="Ajuste os filtros ou crie o primeiro projeto."
          action={{ label: 'Criar projeto', onClick: () => navigate('/projetos/novo') }}
        />
      )}
    </div>
  )
}

export default ListaProjetos
