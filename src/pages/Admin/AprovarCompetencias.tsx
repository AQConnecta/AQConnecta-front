import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Lightbulb, Check, X } from 'lucide-react'
import api from '../../services/api'
import { Competencia, AREA_ATUACAO_LABELS, AreaAtuacao } from '../../services/endpoints/competencia'
import { handleApiError } from '../../lib/errors'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import { LoadingSpinner } from '../../components/LoadingState'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

function AprovarCompetencias() {
  const [pendentes, setPendentes] = useState<Competencia[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.competencia
      .listarPendentes()
      .then((res) => {
        if (active) setPendentes(res.data.data || [])
      })
      .catch((err) => {
        if (active) handleApiError(err, 'Erro ao carregar competências pendentes')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function aprovar(competencia: Competencia) {
    setProcessando(competencia.id)
    try {
      await api.competencia.aprovarCompetencia(competencia.id)
      toast.success('Competência aprovada')
      setPendentes((prev) => prev.filter((c) => c.id !== competencia.id))
    } catch (err) {
      handleApiError(err, 'Erro ao aprovar competência')
    } finally {
      setProcessando(null)
    }
  }

  async function recusar(competencia: Competencia) {
    setProcessando(competencia.id)
    try {
      await api.competencia.recusarCompetencia(competencia.id)
      toast.success('Competência recusada')
      setPendentes((prev) => prev.filter((c) => c.id !== competencia.id))
    } catch (err) {
      handleApiError(err, 'Erro ao recusar competência')
    } finally {
      setProcessando(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Lightbulb}
        title="Competências sugeridas"
        description="Aprove ou recuse as competências sugeridas pelos usuários."
      />

      {loading ? (
        <LoadingSpinner message="Carregando sugestões..." />
      ) : pendentes.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="Nenhuma sugestão pendente"
          description="Não há competências aguardando aprovação."
        />
      ) : (
        <div className="space-y-3">
          {pendentes.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{c.descricao}</span>
                  {c.categoria && (
                    <Badge variant="outline">{AREA_ATUACAO_LABELS[c.categoria as AreaAtuacao]}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => aprovar(c)}
                    disabled={processando === c.id}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => recusar(c)}
                    disabled={processando === c.id}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Recusar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AprovarCompetencias
