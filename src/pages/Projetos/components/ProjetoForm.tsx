import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ImagePlus, Link2, Loader2, Plus, Trash2 } from 'lucide-react'
import api from '../../../services/api'
import { Area } from '../../../services/endpoints/area'
import { Universidade } from '../../../services/endpoints/formacaoAcademica'
import {
  ProjetoImagem,
  ProjetoLink,
  StatusProjeto,
  VisibilidadeProjeto,
  STATUS_LABELS,
  STATUS_OPTIONS,
  VISIBILIDADE_LABELS,
} from '../../../services/endpoints/projeto'
import { handleApiError } from '../../../lib/errors'
import { Card, CardContent } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { ScrollArea } from '../../../components/ui/scroll-area'
import AuthImage from '../../../components/AuthImage'
import { LoadingSpinner } from '../../../components/LoadingState'

function ProjetoForm({ projetoId }: { projetoId?: string }) {
  const isEdit = !!projetoId
  const navigate = useNavigate()

  const [areas, setAreas] = useState<Area[]>([])
  const [universidades, setUniversidades] = useState<Universidade[]>([])
  const [buscaUniversidade, setBuscaUniversidade] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [idArea, setIdArea] = useState('')
  const [idUniversidade, setIdUniversidade] = useState('')
  const [status, setStatus] = useState<StatusProjeto>('ATIVO')
  const [visibilidade, setVisibilidade] = useState<VisibilidadeProjeto>('PUBLICO')
  const [links, setLinks] = useState<ProjetoLink[]>([])
  const [capaFile, setCapaFile] = useState<File | null>(null)
  const [capaPreview, setCapaPreview] = useState<string | null>(null)
  const [existingCapaUrl, setExistingCapaUrl] = useState<string | null>(null)
  const [imagens, setImagens] = useState<ProjetoImagem[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.area.listAll().then((res) => setAreas(res.data.data || [])).catch(() => {})
    api.universidade.getUniversidade().then((res) => setUniversidades(res.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!projetoId) return
    setLoading(true)
    api.projeto
      .localizar(projetoId)
      .then((res) => {
        const p = res.data.data
        setTitulo(p.titulo)
        setDescricao(p.descricao)
        setIdArea(p.area?.id || '')
        setIdUniversidade(p.universidade?.id || '')
        setStatus(p.status)
        setVisibilidade(p.visibilidade)
        setLinks(p.links || [])
        setImagens(p.imagens || [])
        setExistingCapaUrl(p.capaUrl)
      })
      .catch((err) => handleApiError(err, 'Erro ao carregar projeto'))
      .finally(() => setLoading(false))
  }, [projetoId])

  function handleCapaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setCapaFile(f)
      setCapaPreview(URL.createObjectURL(f))
    }
  }

  function addLink() {
    setLinks((prev) => [...prev, { titulo: '', url: '' }])
  }

  function updateLink(index: number, field: 'titulo' | 'url', value: string) {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim() || !descricao.trim() || !idArea) {
      toast.warning('Preencha título, descrição e área.')
      return
    }
    setSubmitting(true)
    try {
      const body = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        idArea,
        idUniversidade: idUniversidade || undefined,
        status,
        visibilidade,
        links: links.filter((l) => l.url && l.url.trim()).map((l) => ({ titulo: l.titulo, url: l.url.trim() })),
      }
      if (isEdit && projetoId) {
        await api.projeto.alterar(projetoId, body)
        if (capaFile) await api.projeto.uploadCapa(projetoId, capaFile)
        toast.success('Projeto atualizado com sucesso')
        navigate(`/projetos/${projetoId}`)
      } else {
        const res = await api.projeto.cadastrar(body)
        const novo = res.data.data
        if (capaFile) await api.projeto.uploadCapa(novo.id, capaFile)
        toast.success('Projeto criado com sucesso')
        navigate(`/projetos/${novo.id}`)
      }
    } catch (err) {
      handleApiError(err, 'Erro ao salvar projeto')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAddImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f || !projetoId) return
    try {
      const res = await api.projeto.adicionarImagem(projetoId, f)
      setImagens((prev) => [...prev, res.data.data])
      toast.success('Imagem adicionada à galeria')
    } catch (err) {
      handleApiError(err, 'Erro ao adicionar imagem')
    } finally {
      e.target.value = ''
    }
  }

  async function handleRemoveImagem(idImagem: string) {
    if (!projetoId) return
    try {
      await api.projeto.removerImagem(projetoId, idImagem)
      setImagens((prev) => prev.filter((i) => i.id !== idImagem))
      toast.success('Imagem removida')
    } catch (err) {
      handleApiError(err, 'Erro ao remover imagem')
    }
  }

  if (loading) return <LoadingSpinner message="Carregando projeto..." />

  const universidadeSelecionada = universidades.find((u) => u.id === idUniversidade)
  const universidadesFiltradas = universidades.filter(
    (u) =>
      u.nomeInstituicao?.toLowerCase().includes(buscaUniversidade.toLowerCase()) ||
      u.sigla?.toLowerCase().includes(buscaUniversidade.toLowerCase()),
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Nome do projeto"
              maxLength={150}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Sobre o projeto, objetivos, público-alvo..."
              rows={5}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="universidade">Instituição vinculada (opcional)</Label>
            <Select value={idUniversidade || 'none'} onValueChange={(v) => setIdUniversidade(v === 'none' ? '' : v)}>
              <SelectTrigger id="universidade">
                <SelectValue placeholder="Selecione a instituição">
                  {universidadeSelecionada
                    ? `${universidadeSelecionada.nomeInstituicao}${universidadeSelecionada.sigla ? ` (${universidadeSelecionada.sigla})` : ''}`
                    : 'Nenhuma'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Buscar instituição..."
                    value={buscaUniversidade}
                    onChange={(e) => setBuscaUniversidade(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyDownCapture={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
                <ScrollArea className="h-48">
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {universidadesFiltradas.map((u) => (
                    <SelectItem key={u.id} value={u.id || ''}>
                      {u.nomeInstituicao}
                      {u.sigla ? ` (${u.sigla})` : ''}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="area">Área</Label>
              <Select value={idArea} onValueChange={setIdArea}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as StatusProjeto)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="visibilidade">Visibilidade</Label>
              <Select value={visibilidade} onValueChange={(v) => setVisibilidade(v as VisibilidadeProjeto)}>
                <SelectTrigger id="visibilidade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLICO">{VISIBILIDADE_LABELS.PUBLICO}</SelectItem>
                  <SelectItem value="PRIVADO">{VISIBILIDADE_LABELS.PRIVADO}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Links externos (opcional)
            </Label>
            {links.map((link, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Rótulo (ex: Instagram)"
                  value={link.titulo || ''}
                  onChange={(e) => updateLink(i, 'titulo', e.target.value)}
                  className="sm:w-48"
                />
                <Input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0 self-end sm:self-auto"
                  onClick={() => removeLink(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addLink}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar link
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label>Imagem de capa</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-40 h-24 rounded-md overflow-hidden border bg-muted shrink-0">
                {capaPreview ? (
                  <img src={capaPreview} alt="Prévia da capa" className="w-full h-full object-cover" />
                ) : existingCapaUrl ? (
                  <AuthImage path={existingCapaUrl} alt="Capa atual" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleCapaChange} className="sm:max-w-xs" />
            </div>
          </div>

          {isEdit && (
            <div className="space-y-1.5">
              <Label>Galeria</Label>
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
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEdit ? `/projetos/${projetoId}` : '/projetos')}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </span>
          ) : isEdit ? (
            'Salvar alterações'
          ) : (
            'Criar projeto'
          )}
        </Button>
      </div>
    </form>
  )
}

export default ProjetoForm
