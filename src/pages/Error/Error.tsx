import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, SearchX } from 'lucide-react'
import { Button } from '../../components/ui/button'

function Error() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md animate-scaleIn">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <SearchX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Página não encontrada
        </h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={() => navigate('/home')}>
            <Home className="w-4 h-4 mr-2" />
            Ir para o início
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Error
