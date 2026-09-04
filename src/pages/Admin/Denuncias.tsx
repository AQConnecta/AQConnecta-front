import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Flag } from 'lucide-react'
import api from '../../services/api'
import {
  Denuncia,
  StatusDenuncia,
  MOTIVO_LABELS,
  DENUNCIA_STATUS_LABELS,
} from '../../services/endpoints/denuncia'
import { handleApiError } from '../../lib/errors'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import { LoadingSpinner } from '../../components/LoadingState'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

function statusVariant(status: StatusDenuncia): 'warning' | 'success' | 'secondary' {
  if (status === 'PENDENTE') return 'warning'
  if (status === 'RESOLVIDO') return 'success'
  return 'secondary'
}

function Denuncias() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('all')

  useEffect(() => {
    let active = true
    setLoading(true)
    api.denuncia
      .listar(filtro === 'all' ? undefined : (filtro as StatusDenuncia))
      .then((res) => {
        if (active) setDenuncias(res.data.data || [])
      })
      .catch((err) => {
        if (active) handleApiError(err, 'Erro ao carregar denúncias')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [filtro])

  async function alterar(denuncia: Denuncia, status: StatusDenuncia) {
    try {
      await api.denuncia.alterarStatus(denuncia.id, status)
      toast.success('Status atualizado')
      setDenuncias((prev) => prev.map((d) => (d.id === denuncia.id ? { ...d, status } : d)))
    } catch (err) {
      handleApiError(err, 'Erro ao atualizar status')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Flag}
        title="Denúncias de projetos"
        description="Revise os reports enviados pelos usuários."
        actions={
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PENDENTE">Pendentes</SelectItem>
              <SelectItem value="RESOLVIDO">Resolvidos</SelectItem>
              <SelectItem value="IGNORADO">Ignorados</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {loading ? (
        <LoadingSpinner message="Carregando denúncias..." />
      ) : denuncias.length === 0 ? (
        <EmptyState icon={Flag} title="Nenhuma denúncia" description="Não há denúncias para este filtro." />
      ) : (
        <div className="space-y-3">
          {denuncias.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={statusVariant(d.status)}>{DENUNCIA_STATUS_LABELS[d.status]}</Badge>
                    <Badge variant="outline">{MOTIVO_LABELS[d.motivo]}</Badge>
                    <Link to={`/projetos/${d.projetoId}`} className="font-medium text-foreground hover:underline">
                      {d.projetoTitulo}
                    </Link>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(d.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {d.descricao && <p className="text-sm text-muted-foreground">{d.descricao}</p>}
                <p className="text-xs text-muted-foreground">
                  por {d.denunciante?.nome || 'Anônimo'}
                  {d.resolvidoPorNome ? ` · tratado por ${d.resolvidoPorNome}` : ''}
                </p>
                <div className="flex gap-2 pt-1 flex-wrap">
                  {d.status !== 'RESOLVIDO' && (
                    <Button size="sm" variant="outline" onClick={() => alterar(d, 'RESOLVIDO')}>
                      Marcar resolvido
                    </Button>
                  )}
                  {d.status !== 'IGNORADO' && (
                    <Button size="sm" variant="ghost" onClick={() => alterar(d, 'IGNORADO')}>
                      Ignorar
                    </Button>
                  )}
                  {d.status !== 'PENDENTE' && (
                    <Button size="sm" variant="ghost" onClick={() => alterar(d, 'PENDENTE')}>
                      Reabrir
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Denuncias
