import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, FileText, MessageCircle, Pencil, Trash2 } from 'lucide-react'
import api from '../../services/api'
import { Postagem, POST_STATUS_LABELS } from '../../services/endpoints/postagem'
import { handleApiError } from '../../lib/errors'
import { cn } from '../../lib/utils'
import { LoadingSpinner } from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import AuthImage from '../../components/AuthImage'
import RichText from '../../components/RichText'
import Comentarios from '../../components/Comentarios'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'

function formatarData(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

function PostDetalhe() {
  const { id, postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Postagem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.postagem
      .localizar(id!, postId!)
      .then((res) => {
        if (active) setPost(res.data.data)
      })
      .catch((err) => {
        if (active) handleApiError(err, 'Erro ao carregar post')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, postId])

  async function handleDelete() {
    if (!id || !postId) return
    if (!window.confirm('Excluir este post?')) return
    try {
      await api.postagem.deletar(id, postId)
      toast.success('Post excluído')
      navigate(`/projetos/${id}`)
    } catch (err) {
      handleApiError(err, 'Erro ao excluir post')
    }
  }

  if (loading) return <LoadingSpinner message="Carregando post..." />
  if (!post) {
    return (
      <EmptyState
        icon={FileText}
        title="Post não encontrado"
        action={{ label: 'Voltar ao projeto', onClick: () => navigate(`/projetos/${id}`) }}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/projetos/${id}`)} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar ao projeto
      </Button>

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-2">
          {post.status === 'RASCUNHO' && <Badge variant="warning">{POST_STATUS_LABELS.RASCUNHO}</Badge>}
          <h1 className="text-2xl font-bold text-foreground">{post.titulo}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.autor?.fotoPerfil || undefined} />
              <AvatarFallback>{post.autor?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <span>{post.autor?.nome}</span>
            <span>·</span>
            <span>{formatarData(post.publicadoEm || post.criadoEm)}</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.totalComentarios}
            </span>
          </div>
        </div>
        {post.podeEditar && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/projetos/${id}/posts/${postId}/editar`)}>
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <RichText value={post.corpo} editable={false} />
        </CardContent>
      </Card>

      {post.imagens.length === 1 && (
        <div className="overflow-hidden rounded-xl border bg-muted/40 flex items-center justify-center">
          <AuthImage
            path={post.imagens[0].url}
            alt=""
            className="w-full max-h-[70vh] object-contain"
          />
        </div>
      )}

      {post.imagens.length > 1 && (
        <div
          className={cn(
            'grid gap-1 overflow-hidden rounded-xl border',
            post.imagens.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3',
          )}
        >
          {post.imagens.map((img) => (
            <div key={img.id} className="aspect-square overflow-hidden bg-muted">
              <AuthImage path={img.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <Comentarios idProjeto={id!} idPost={postId!} />
        </CardContent>
      </Card>
    </div>
  )
}

export default PostDetalhe
