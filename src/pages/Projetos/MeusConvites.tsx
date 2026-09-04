import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FolderKanban, Mail } from 'lucide-react'
import api from '../../services/api'
import { Convite, PAPEL_LABELS } from '../../services/endpoints/projeto'
import { handleApiError } from '../../lib/errors'
import { LoadingSpinner } from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import AuthImage from '../../components/AuthImage'
import PageHeader from '../../components/PageHeader'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

function MeusConvites() {
  const navigate = useNavigate()
  const [convites, setConvites] = useState<Convite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.projeto
      .listarMeusConvites()
      .then((res) => {
        if (active) setConvites(res.data.data || [])
      })
      .catch((err) => {
        if (active) handleApiError(err, 'Erro ao carregar convites')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function handleAceitar(convite: Convite) {
    try {
      await api.projeto.aceitarConvite(convite.id)
      toast.success('Convite aceito!')
      navigate(`/projetos/${convite.projetoId}`)
    } catch (err) {
      handleApiError(err, 'Erro ao aceitar convite')
    }
  }

  async function handleRecusar(convite: Convite) {
    try {
      await api.projeto.recusarConvite(convite.id)
      toast.success('Convite recusado')
      setConvites((prev) => prev.filter((c) => c.id !== convite.id))
    } catch (err) {
      handleApiError(err, 'Erro ao recusar convite')
    }
  }

  if (loading) return <LoadingSpinner message="Carregando convites..." />

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader icon={Mail} title="Meus convites" description="Convites de projeto pendentes." />
      {convites.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="Nenhum convite pendente"
          description="Quando você for convidado para um projeto, aparecerá aqui."
        />
      ) : (
        <div className="space-y-3">
          {convites.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                    {c.projetoCapaUrl ? (
                      <AuthImage path={c.projetoCapaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderKanban className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{c.projetoTitulo}</p>
                    <p className="text-xs text-muted-foreground">
                      Convidado por
                      {' '}
                      {c.convidadoPorNome}
                      {' '}
                      como
                      {' '}
                      {PAPEL_LABELS[c.papel]}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRecusar(c)}>
                    Recusar
                  </Button>
                  <Button size="sm" onClick={() => handleAceitar(c)}>
                    Aceitar
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

export default MeusConvites
