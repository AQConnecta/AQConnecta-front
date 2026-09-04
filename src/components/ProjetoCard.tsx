import { Link } from 'react-router-dom'
import { FolderKanban, Globe, Lock } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import AuthImage from './AuthImage'
import { ProjetoResumo, STATUS_LABELS, statusVariant } from '../services/endpoints/projeto'

function ProjetoCard({ projeto }: { projeto: ProjetoResumo }) {
  return (
    <Link to={`/projetos/${projeto.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="aspect-video bg-muted">
          {projeto.capaUrl ? (
            <AuthImage path={projeto.capaUrl} alt={projeto.titulo} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderKanban className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusVariant(projeto.status)}>{STATUS_LABELS[projeto.status]}</Badge>
            {projeto.visibilidade === 'PRIVADO' ? (
              <Badge variant="outline">
                <Lock className="w-3 h-3 mr-1" />
                Privado
              </Badge>
            ) : (
              <Badge variant="outline">
                <Globe className="w-3 h-3 mr-1" />
                Público
              </Badge>
            )}
            {projeto.area && <Badge variant="info">{projeto.area.descricao}</Badge>}
          </div>
          <h3 className="font-bold text-foreground line-clamp-1">{projeto.titulo}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{projeto.descricao}</p>
          <p className="text-xs text-muted-foreground">
            por
            {projeto.donoNome}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProjetoCard
