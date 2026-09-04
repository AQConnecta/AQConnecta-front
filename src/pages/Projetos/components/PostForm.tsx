import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react'
import api from '../../../services/api'
import { ProjetoImagem } from '../../../services/endpoints/projeto'
import { StatusPostagem } from '../../../services/endpoints/postagem'
import { handleApiError } from '../../../lib/errors'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import RichText from '../../../components/RichText'
import AuthImage from '../../../components/AuthImage'
import { LoadingSpinner } from '../../../components/LoadingState'

function PostForm({ idProjeto, postId }: { idProjeto: string; postId?: string }) {
  const isEdit = !!postId
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [corpo, setCorpo] = useState('')
  const [imagens, setImagens] = useState<ProjetoImagem[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!postId) return
    setLoading(true)
    api.postagem
      .localizar(idProjeto, postId)
      .then((res) => {
        const p = res.data.data
        setTitulo(p.titulo)
        setCorpo(p.corpo)
        setImagens(p.imagens || [])
      })
      .catch((err) => handleApiError(err, 'Erro ao carregar post'))
      .finally(() => setLoading(false))
  }, [idProjeto, postId])

  async function salvar(status: StatusPostagem) {
    if (!titulo.trim()) {
      toast.warning('Informe o título.')
      return
    }
    if (!corpo || corpo === '<p></p>') {
      toast.warning('Escreva o conteúdo do post.')
      return
    }
    setSubmitting(true)
    try {
      const body = { titulo: titulo.trim(), corpo, status }
      if (isEdit && postId) {
        await api.postagem.alterar(idProjeto, postId, body)
        toast.success('Post atualizado')
        navigate(`/projetos/${idProjeto}/posts/${postId}`)
      } else {
        const res = await api.postagem.criar(idProjeto, body)
        toast.success(status === 'PUBLICADO' ? 'Post publicado' : 'Rascunho salvo')
        navigate(`/projetos/${idProjeto}/posts/${res.data.data.id}`)
      }
    } catch (err) {
      handleApiError(err, 'Erro ao salvar post')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f || !postId) return
    try {
      const res = await api.postagem.adicionarImagem(idProjeto, postId, f)
      setImagens((prev) => [...prev, res.data.data])
      toast.success('Imagem adicionada')
    } catch (err) {
      handleApiError(err, 'Erro ao adicionar imagem')
    } finally {
      e.target.value = ''
    }
  }

  async function handleRemoveImagem(idImagem: string) {
    if (!postId) return
    try {
      await api.postagem.removerImagem(idProjeto, postId, idImagem)
      setImagens((prev) => prev.filter((i) => i.id !== idImagem))
      toast.success('Imagem removida')
    } catch (err) {
      handleApiError(err, 'Erro ao remover imagem')
    }
  }

  if (loading) return <LoadingSpinner message="Carregando post..." />

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Título do post"
              maxLength={200}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Conteúdo</Label>
            <RichText value={corpo} onChange={setCorpo} />
          </div>
          {isEdit ? (
            <div className="space-y-1.5">
              <Label>Imagens anexadas</Label>
              <div className="flex flex-wrap gap-3">
                {imagens.map((img) => (
                  <div key={img.id} className="relative w-24 h-24 rounded-md overflow-hidden border group">
                    <AuthImage path={img.url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImagem(img.id)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAddImagem} />
                </label>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ImagePlus className="w-3.5 h-3.5" />
              Você poderá anexar imagens após salvar o post.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEdit ? `/projetos/${idProjeto}/posts/${postId}` : `/projetos/${idProjeto}`)}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="button" variant="secondary" onClick={() => salvar('RASCUNHO')} disabled={submitting}>
          Salvar rascunho
        </Button>
        <Button type="button" onClick={() => salvar('PUBLICADO')} disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </span>
          ) : (
            'Publicar'
          )}
        </Button>
      </div>
    </div>
  )
}

export default PostForm
