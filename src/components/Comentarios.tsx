import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Trash2 } from 'lucide-react'
import api from '../services/api'
import { Comentario } from '../services/endpoints/postagem'
import { handleApiError } from '../lib/errors'
import { useAuth } from '../contexts/AuthContext'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LoadingSpinner } from './LoadingState'

const COMENTARIOS_SIZE = 20

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function ComentarioItem({
  comentario,
  onResponder,
  onDeletar,
  isReply,
}: {
  comentario: Comentario
  onResponder?: (idPai: string, corpo: string) => Promise<void>
  onDeletar: (id: string) => void
  isReply?: boolean
}) {
  const [respondendo, setRespondendo] = useState(false)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    if (!texto.trim() || !onResponder) return
    setEnviando(true)
    try {
      await onResponder(comentario.id, texto.trim())
      setTexto('')
      setRespondendo(false)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src={comentario.autor?.fotoPerfil || undefined} />
        <AvatarFallback>{comentario.autor?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-muted rounded-lg px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{comentario.autor?.nome}</span>
            <span className="text-xs text-muted-foreground">{formatarData(comentario.criadoEm)}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">{comentario.corpo}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 ml-1">
          {!isReply && onResponder && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setRespondendo((v) => !v)}
            >
              Responder
            </button>
          )}
          {comentario.podeDeletar && (
            <button
              type="button"
              className="text-xs text-destructive hover:underline flex items-center gap-1"
              onClick={() => onDeletar(comentario.id)}
            >
              <Trash2 className="w-3 h-3" />
              Excluir
            </button>
          )}
        </div>
        {respondendo && (
          <div className="mt-2 flex gap-2">
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva uma resposta..."
              rows={2}
              className="text-sm"
            />
            <Button size="sm" disabled={enviando || !texto.trim()} onClick={enviar}>
              Enviar
            </Button>
          </div>
        )}
        {comentario.respostas.length > 0 && (
          <div className="mt-3 space-y-3 pl-2 border-l">
            {comentario.respostas.map((r) => (
              <ComentarioItem key={r.id} comentario={r} onDeletar={onDeletar} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Comentarios({ idProjeto, idPost }: { idProjeto: string; idPost: string }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [page, setPage] = useState(0)
  const [temMais, setTemMais] = useState(false)
  const [loading, setLoading] = useState(false)
  const [novo, setNovo] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function carregar(pageToLoad: number) {
    setLoading(true)
    try {
      const res = await api.postagem.listarComentarios(idProjeto, idPost, pageToLoad, COMENTARIOS_SIZE)
      const novos = res.data.data || []
      setComentarios((prev) => (pageToLoad === 0 ? novos : [...prev, ...novos]))
      setTemMais(novos.length === COMENTARIOS_SIZE)
      setPage(pageToLoad)
    } catch (err) {
      handleApiError(err, 'Erro ao carregar comentários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idProjeto, idPost])

  const sentinelRef = useInfiniteScroll(() => carregar(page + 1), temMais, loading)

  async function comentar() {
    if (!novo.trim()) return
    setEnviando(true)
    try {
      await api.postagem.comentar(idProjeto, idPost, { corpo: novo.trim() })
      setNovo('')
      carregar(0)
    } catch (err) {
      handleApiError(err, 'Erro ao comentar')
    } finally {
      setEnviando(false)
    }
  }

  async function responder(idPai: string, corpo: string) {
    try {
      await api.postagem.comentar(idProjeto, idPost, { corpo, idComentarioPai: idPai })
      carregar(0)
    } catch (err) {
      handleApiError(err, 'Erro ao responder')
    }
  }

  async function deletar(idComentario: string) {
    if (!window.confirm('Excluir este comentário?')) return
    try {
      await api.postagem.deletarComentario(idProjeto, idPost, idComentario)
      carregar(0)
    } catch (err) {
      handleApiError(err, 'Erro ao excluir comentário')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        Comentários
      </h2>
      {user ? (
        <div className="flex gap-2">
          <Textarea value={novo} onChange={(e) => setNovo(e.target.value)} placeholder="Escreva um comentário..." rows={2} />
          <Button disabled={enviando || !novo.trim()} onClick={comentar}>
            Comentar
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-3">
          <span className="text-sm text-muted-foreground">Entre para comentar.</span>
          <Button size="sm" onClick={() => navigate('/login')}>Entrar</Button>
        </div>
      )}
      {comentarios.length === 0 && !loading ? (
        <p className="text-sm text-muted-foreground">Seja o primeiro a comentar.</p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((c) => (
            <ComentarioItem key={c.id} comentario={c} onResponder={user ? responder : undefined} onDeletar={deletar} />
          ))}
        </div>
      )}
      {loading && <LoadingSpinner message="" />}
      <div ref={sentinelRef} />
    </div>
  )
}

export default Comentarios
