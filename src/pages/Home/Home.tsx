import { useEffect, useState } from 'react'
import { Briefcase } from 'lucide-react'
import { Vaga } from '../../services/endpoints/vaga'
import { handleApiError } from '../../lib/errors'
import api from '../../services/api'
import CreateVaga from './components/CreateVaga'
import VagaCard from '../../components/VagaCard'
import EmptyState from '../../components/EmptyState'
import { CardSkeleton } from '../../components/LoadingState'
import { useAuth } from '../../contexts/AuthContext'

function Home() {
  const { user } = useAuth()
  const [vagas, setVagas] = useState<Array<Vaga>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shouldReload, setShouldReload] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function getVagas() {
      setIsLoading(true)
      try {
        const res = await api.vaga.listAll()
        if (!cancelled) {
          if (res.data?.data && res.data.data.length > 0) {
            setVagas(res.data.data)
          } else {
            setVagas([])
          }
        }
      } catch (err) {
        if (!cancelled) {
          handleApiError(err, 'Erro ao buscar vagas')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    getVagas()
    return () => { cancelled = true }
  }, [shouldReload])

  function reloadVagas() {
    setShouldReload((prev) => prev + 1)
  }

  return (
    <div className="max-w-[700px] w-full mx-auto px-2 md:px-4">
      {user && (
        <CreateVaga
          className="w-full mb-4"
          reloadVagas={reloadVagas}
        />
      )}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <CardSkeleton count={3} />
        ) : vagas.length > 0 ? (
          vagas.map((vaga) => (
            <VagaCard
              key={vaga.id}
              vaga={vaga}
              reloadVagas={reloadVagas}
              hideButton={false}
            />
          ))
        ) : (
          <EmptyState
            icon={Briefcase}
            title="Nenhuma vaga encontrada"
            description="Quando vagas forem publicadas, elas aparecerão aqui."
          />
        )}
      </div>
    </div>
  )
}

export default Home
