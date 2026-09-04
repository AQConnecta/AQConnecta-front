import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import AuthImage from './AuthImage'
import { PostagemResumo, POST_STATUS_LABELS } from '../services/endpoints/postagem'

function formatarData(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

function PostCard({ post }: { post: PostagemResumo }) {
  return (
    <Link to={`/projetos/${post.projetoId}/posts/${post.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex gap-4">
          {post.capaUrl && (
            <div className="w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0 hidden sm:block">
              <AuthImage path={post.capaUrl} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {post.status === 'RASCUNHO' && (
              <Badge variant="warning" className="mb-1">
                {POST_STATUS_LABELS.RASCUNHO}
              </Badge>
            )}
            <h3 className="font-bold text-foreground line-clamp-1">{post.titulo}</h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
              <Avatar className="w-5 h-5">
                <AvatarImage src={post.autor?.fotoPerfil || undefined} />
                <AvatarFallback>{post.autor?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <span>{post.autor?.nome}</span>
              <span>·</span>
              <span>{formatarData(post.publicadoEm || post.criadoEm)}</span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.totalComentarios}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default PostCard
