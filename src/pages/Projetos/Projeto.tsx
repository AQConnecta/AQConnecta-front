import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Briefcase, Building2, ExternalLink, FileText, Flag, FolderKanban, Globe, Heart, Lock, Pencil, Plus, Trash2, Users } from 'lucide-react'
import api from '../../services/api'
import {
  Projeto as ProjetoType,
  STATUS_LABELS,
  VISIBILIDADE_LABELS,
  statusVariant,
  podeGerenciar as canManage,
} from '../../services/endpoints/projeto'
import { PostagemResumo } from '../../services/endpoints/postagem'
import { handleApiError } from '../../lib/errors'
import { cn } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import { useRequireAuth } from '../../hooks/useRequireAuth'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { LoadingSpinner } from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import AuthImage from '../../components/AuthImage'
import PostCard from '../../components/PostCard'
import DenunciarModal from '../../components/DenunciarModal'
import VagaCard from '../../components/VagaCard'
import { Vaga } from '../../services/endpoints/vaga'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'

const POSTS_SIZE = 5

function safeHref(url: string): string {
  try {
    const u = new URL(url, window.location.origin)
    return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? url : '#'
  } catch {
    return '#'
  }
}

function ProjetoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const requireAuth = useRequireAuth()
  const [projeto, setProjeto] = useState<ProjetoType | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<PostagemResumo[]>([])
  const [postsPage, setPostsPage] = useState(0)
  const [postsTemMais, setPostsTemMais] = useState(false)
  const [postsLoading, setPostsLoading] = useState(false)
  const [denunciaOpen, setDenunciaOpen] = useState(false)
  const [vagas, setVagas] = useState<Vaga[]>([])

  useEffect(() => {
    let active = true
    setLoading(true)
    api.projeto
      .localizar(id!)
      .then((res) => {
        if (active) setProjeto(res.data.data)
      })
      .catch((err) => {
        if (active) handleApiError(err, 'Erro ao carregar projeto')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  async function carregarPosts(page: number) {
    if (!id) return
    setPostsLoading(true)
    try {
      const res = await api.postagem.listar(id, page, POSTS_SIZE)
      const novos = res.data.data || []
      setPosts((prev) => (page === 0 ? novos : [...prev, ...novos]))
      setPostsTemMais(novos.length === POSTS_SIZE)
      setPostsPage(page)
    } catch (err) {
      handleApiError(err, 'Erro ao carregar posts')
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    setPosts([])
    carregarPosts(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const postsSentinelRef = useInfiniteScroll(() => carregarPosts(postsPage + 1), postsTemMais, postsLoading)

  function carregarVagas() {
    if (!id) return
    api.vaga
      .listByProjeto(id)
      .then((res) => setVagas(res.data.data || []))
      .catch(() => {})
  }

  useEffect(() => {
    carregarVagas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleToggleSeguir() {
    if (!projeto) return
    try {
      const res = projeto.seguindo
        ? await api.projeto.deixarDeSeguir(projeto.id)
        : await api.projeto.seguir(projeto.id)
      const novoTotal = res.data.data
      setProjeto({
        ...projeto,
        seguindo: !projeto.seguindo,
        totalSeguidores: typeof novoTotal === 'number' ? novoTotal : projeto.totalSeguidores,
      })
    } catch (err) {
      handleApiError(err, 'Erro ao atualizar')
    }
  }

  async function handleDelete() {
    if (!id) return
    if (!window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) return
    try {
      await api.projeto.deletar(id)
      toast.success('Projeto excluído')
      navigate('/projetos')
    } catch (err) {
      handleApiError(err, 'Erro ao excluir projeto')
    }
  }

  if (loading) return <LoadingSpinner message="Carregando projeto..." />
  if (!projeto) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Projeto não encontrado"
        action={{ label: 'Ver projetos', onClick: () => navigate('/projetos') }}
      />
    )
  }

  const gerencia = canManage(projeto.papelUsuarioAtual)
  const ehDono = projeto.papelUsuarioAtual === 'DONO'
  const vagasAtivas = vagas.filter(
    (v) => !v.dataLimiteCandidatura || new Date(v.dataLimiteCandidatura) > new Date(),
  ).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="aspect-[3/1] bg-muted rounded-xl overflow-hidden">
        {projeto.capaUrl ? (
          <AuthImage path={projeto.capaUrl} alt={projeto.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderKanban className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusVariant(projeto.status)}>{STATUS_LABELS[projeto.status]}</Badge>
            {projeto.visibilidade === 'PRIVADO' ? (
              <Badge variant="outline">
                <Lock className="w-3 h-3 mr-1" />
                {VISIBILIDADE_LABELS.PRIVADO}
              </Badge>
            ) : (
              <Badge variant="outline">
                <Globe className="w-3 h-3 mr-1" />
                {VISIBILIDADE_LABELS.PUBLICO}
              </Badge>
            )}
            {projeto.area && <Badge variant="info">{projeto.area.descricao}</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{projeto.titulo}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {projeto.totalMembros} membro(s)
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {projeto.totalSeguidores} seguidor(es)
            </span>
            <span>· por {projeto.dono?.nome || 'Desconhecido'}</span>
            {projeto.universidade && (
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {projeto.universidade.sigla || projeto.universidade.nomeInstituicao}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {projeto.visibilidade === 'PUBLICO' && (
            <Button
              variant={projeto.seguindo ? 'secondary' : 'default'}
              onClick={() => requireAuth(handleToggleSeguir)}
            >
              <Heart className={cn('w-4 h-4 mr-2', projeto.seguindo && 'fill-current')} />
              {projeto.seguindo ? 'Seguindo' : 'Seguir'}
            </Button>
          )}
          {gerencia && (
            <>
              <Button variant="outline" onClick={() => navigate(`/projetos/${projeto.id}/membros`)}>
                <Users className="w-4 h-4 mr-2" />
                Membros
              </Button>
              <Button variant="outline" onClick={() => navigate(`/projetos/${projeto.id}/editar`)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
              {ehDono && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
            </>
          )}
          {user && !ehDono && (
            <Button variant="ghost" size="icon" title="Denunciar projeto" onClick={() => setDenunciaOpen(true)}>
              <Flag className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="sobre" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="sobre">
            <FolderKanban className="w-4 h-4 mr-1.5" />
            Visão geral
          </TabsTrigger>
          <TabsTrigger value="vagas">
            <Briefcase className="w-4 h-4 mr-1.5" />
            Vagas
            {vagas.length > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground">
                {vagas.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="posts">
            <FileText className="w-4 h-4 mr-1.5" />
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sobre" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground mb-2">Sobre</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{projeto.descricao}</p>
            </CardContent>
          </Card>

          {projeto.imagens.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-3">Galeria</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {projeto.imagens.map((img) => (
                    <div key={img.id} className="aspect-square rounded-md overflow-hidden border">
                      <AuthImage path={img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {projeto.links.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Links
                </h2>
                <div className="flex flex-wrap gap-2">
                  {projeto.links.map((l) => (
                    <a
                      key={l.id || l.url}
                      href={safeHref(l.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 border rounded-md px-3 py-1.5 break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      {l.titulo || l.url}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="vagas" className="space-y-4 mt-6">
          {vagas.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="Nenhuma vaga"
              description="Este projeto ainda não tem vagas vinculadas."
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {vagasAtivas} vaga(s) ativa(s) de {vagas.length} no total
              </p>
              <div className="space-y-3">
                {vagas.map((v) => (
                  <VagaCard key={v.id} vaga={v} reloadVagas={carregarVagas} />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {gerencia && (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => navigate(`/projetos/${projeto.id}/posts/novo`)}>
                <Plus className="w-4 h-4 mr-1" />
                Novo post
              </Button>
            </div>
          )}

          {posts.length === 0 && !postsLoading ? (
            <EmptyState
              icon={FileText}
              title="Nenhum post ainda"
              description={gerencia ? 'Publique o primeiro post deste projeto.' : 'Este projeto ainda não publicou nada.'}
            />
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}

          {postsLoading && <LoadingSpinner message="" />}
          <div ref={postsSentinelRef} />
        </TabsContent>
      </Tabs>

      {id && <DenunciarModal idProjeto={id} isOpen={denunciaOpen} onClose={() => setDenunciaOpen(false)} />}
    </div>
  )
}

export default ProjetoPage
