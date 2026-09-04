import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import api from '../../services/api'
import { ProjetoResumo } from '../../services/endpoints/projeto'
import { handleApiError } from '../../lib/errors'
import PageHeader from '../../components/PageHeader'
import EmptyState from '../../components/EmptyState'
import { CardSkeleton } from '../../components/LoadingState'
import ProjetoCard from '../../components/ProjetoCard'

function ProjetosSeguidos() {
  const navigate = useNavigate()
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.projeto
      .listarSeguidos()
      .then((res) => {
        if (active) setProjetos(res.data.data || [])
      })
      .catch((err) => {
        if (active) handleApiError(err, 'Erro ao carregar projetos')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader icon={Heart} title="Projetos que sigo" description="Acompanhe os projetos que você segue." />
      {loading ? (
        <CardSkeleton count={6} />
      ) : projetos.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Você não segue nenhum projeto"
          description="Siga projetos públicos para acompanhá-los aqui."
          action={{ label: 'Explorar projetos', onClick: () => navigate('/projetos') }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((p) => (
            <ProjetoCard key={p.id} projeto={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjetosSeguidos
