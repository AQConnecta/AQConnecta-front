import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Crown, Mail, RotateCcw, Search, Trash2, UserPlus, Users } from 'lucide-react'
import api from '../../services/api'
import {
  Convite,
  Membro,
  PapelProjeto,
  Projeto as ProjetoType,
  UsuarioResumo,
  PAPEL_LABELS,
  podeGerenciar as canManage,
} from '../../services/endpoints/projeto'
import { handleApiError } from '../../lib/errors'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { LoadingSpinner } from '../../components/LoadingState'
import PageHeader from '../../components/PageHeader'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

const MEMBROS_SIZE = 20

function GerenciarMembros() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projeto, setProjeto] = useState<ProjetoType | null>(null)
  const [dono, setDono] = useState<Membro | null>(null)
  const [membrosData, setMembrosData] = useState<Membro[]>([])
  const [membrosPage, setMembrosPage] = useState(0)
  const [membrosTemMais, setMembrosTemMais] = useState(false)
  const [membrosLoading, setMembrosLoading] = useState(false)
  const [loadingProjeto, setLoadingProjeto] = useState(true)
  const [convites, setConvites] = useState<Convite[]>([])
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<UsuarioResumo[]>([])
  const [buscando, setBuscando] = useState(false)
  const [papelConvite, setPapelConvite] = useState<PapelProjeto>('EDITOR')

  const gerencia = canManage(projeto?.papelUsuarioAtual ?? null)
  const ehDono = projeto?.papelUsuarioAtual === 'DONO'

  async function carregarMembros(page: number) {
    if (!id) return
    setMembrosLoading(true)
    try {
      const res = await api.projeto.listarMembros(id, page, MEMBROS_SIZE)
      const data = res.data.data
      setDono(data.dono)
      setMembrosData((prev) => (page === 0 ? data.membros : [...prev, ...data.membros]))
      setMembrosTemMais(data.membros.length === MEMBROS_SIZE)
      setMembrosPage(page)
    } catch (err) {
      handleApiError(err, 'Erro ao carregar membros')
    } finally {
      setMembrosLoading(false)
    }
  }

  function carregarProjeto() {
    if (!id) return
    api.projeto
      .localizar(id)
      .then((res) => setProjeto(res.data.data))
      .catch((err) => handleApiError(err, 'Erro ao carregar projeto'))
      .finally(() => setLoadingProjeto(false))
  }

  useEffect(() => {
    carregarProjeto()
    carregarMembros(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!id || !gerencia) return
    api.projeto.listarConvitesProjeto(id).then((res) => setConvites(res.data.data || [])).catch(() => {})
  }, [id, gerencia])

  useEffect(() => {
    if (!id || !gerencia) return
    if (busca.trim().length < 2) {
      setResultados([])
      return
    }
    let active = true
    setBuscando(true)
    const timer = setTimeout(() => {
      api.projeto
        .buscarUsuarios(id, busca.trim())
        .then((res) => {
          if (active) setResultados(res.data.data || [])
        })
        .catch(() => {
          if (active) setResultados([])
        })
        .finally(() => {
          if (active) setBuscando(false)
        })
    }, 350)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [busca, id, gerencia])

  const sentinelRef = useInfiniteScroll(() => carregarMembros(membrosPage + 1), membrosTemMais, membrosLoading)

  function recarregarMembros() {
    carregarMembros(0)
  }

  async function recarregarConvites() {
    if (!id) return
    try {
      const res = await api.projeto.listarConvitesProjeto(id)
      setConvites(res.data.data || [])
    } catch {
      /* silencioso */
    }
  }

  async function handleConvidar(usuario: UsuarioResumo) {
    if (!id) return
    try {
      await api.projeto.convidar(id, { idUsuario: usuario.id, papel: papelConvite })
      toast.success(`Convite enviado para ${usuario.nome}`)
      setBusca('')
      setResultados([])
      recarregarConvites()
    } catch (err) {
      handleApiError(err, 'Erro ao enviar convite')
    }
  }

  async function handleAlterarPapel(membro: Membro, papel: PapelProjeto) {
    if (!id || !membro.id) return
    try {
      await api.projeto.alterarPapelMembro(id, membro.id, papel)
      toast.success('Papel atualizado')
      recarregarMembros()
    } catch (err) {
      handleApiError(err, 'Erro ao alterar papel')
    }
  }

  async function handleRemover(membro: Membro) {
    if (!id || !membro.id) return
    if (!window.confirm(`Remover ${membro.usuario?.nome} do projeto?`)) return
    try {
      await api.projeto.removerMembro(id, membro.id)
      toast.success('Membro removido')
      recarregarMembros()
    } catch (err) {
      handleApiError(err, 'Erro ao remover membro')
    }
  }

  async function handleReativar(membro: Membro) {
    if (!id || !membro.id) return
    try {
      await api.projeto.reativarMembro(id, membro.id)
      toast.success('Membro reativado')
      recarregarMembros()
    } catch (err) {
      handleApiError(err, 'Erro ao reativar membro')
    }
  }

  async function handleTransferir(membro: Membro) {
    if (!id || !membro.usuario) return
    if (!window.confirm(`Transferir a propriedade para ${membro.usuario.nome}? Você passará a ser Editor.`)) return
    try {
      await api.projeto.transferirOwnership(id, membro.usuario.id)
      toast.success('Propriedade transferida')
      carregarProjeto()
      recarregarMembros()
    } catch (err) {
      handleApiError(err, 'Erro ao transferir propriedade')
    }
  }

  if (loadingProjeto && !projeto) return <LoadingSpinner message="Carregando membros..." />
  if (!projeto) return null

  const ativos = membrosData.filter((m) => m.ativo)
  const inativos = membrosData.filter((m) => !m.ativo)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/projetos/${id}`)} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar ao projeto
      </Button>
      <PageHeader icon={Users} title="Membros" description={projeto.titulo} />

      {gerencia && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Convidar membro
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={papelConvite} onValueChange={(v) => setPapelConvite(v as PapelProjeto)}>
                <SelectTrigger className="sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">{PAPEL_LABELS.EDITOR}</SelectItem>
                  <SelectItem value="VISUALIZADOR">{PAPEL_LABELS.VISUALIZADOR}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {buscando && <p className="text-xs text-muted-foreground">Buscando...</p>}
            {resultados.length > 0 && (
              <div className="border rounded-md divide-y">
                {resultados.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={u.fotoPerfil || undefined} />
                        <AvatarFallback>{u.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.nome}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleConvidar(u)}>
                      Convidar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {gerencia && convites.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Convites pendentes
            </h2>
            <div className="space-y-2">
              {convites.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={c.usuario?.fotoPerfil || undefined} />
                      <AvatarFallback>{c.usuario?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{c.usuario?.nome}</p>
                      <p className="text-xs text-muted-foreground">{c.usuario?.email}</p>
                    </div>
                  </div>
                  <Badge variant="warning">{PAPEL_LABELS[c.papel]} · pendente</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold text-foreground">Membros ativos</h2>
          <div className="space-y-3">
            {dono && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={dono.usuario?.fotoPerfil || undefined} />
                    <AvatarFallback>{dono.usuario?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{dono.usuario?.nome}</p>
                    <p className="text-xs text-muted-foreground">{dono.usuario?.email}</p>
                  </div>
                </div>
                <Badge>
                  <Crown className="w-3 h-3 mr-1" />
                  Dono
                </Badge>
              </div>
            )}

            {ativos.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={m.usuario?.fotoPerfil || undefined} />
                    <AvatarFallback>{m.usuario?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{m.usuario?.nome}</p>
                    <p className="text-xs text-muted-foreground">{m.usuario?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {gerencia ? (
                    <Select value={m.papel} onValueChange={(v) => handleAlterarPapel(m, v as PapelProjeto)}>
                      <SelectTrigger className="w-40 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EDITOR">{PAPEL_LABELS.EDITOR}</SelectItem>
                        <SelectItem value="VISUALIZADOR">{PAPEL_LABELS.VISUALIZADOR}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary">{PAPEL_LABELS[m.papel]}</Badge>
                  )}
                  {ehDono && m.papel === 'EDITOR' && (
                    <Button variant="ghost" size="icon" title="Transferir propriedade" onClick={() => handleTransferir(m)}>
                      <Crown className="w-4 h-4" />
                    </Button>
                  )}
                  {gerencia && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      title="Remover"
                      onClick={() => handleRemover(m)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {ativos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum membro além do dono.</p>}
          </div>
        </CardContent>
      </Card>

      {inativos.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-foreground">Ex-membros</h2>
            <div className="space-y-2">
              {inativos.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 opacity-70">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={m.usuario?.fotoPerfil || undefined} />
                      <AvatarFallback>{m.usuario?.nome?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{m.usuario?.nome}</p>
                      <p className="text-xs text-muted-foreground">{PAPEL_LABELS[m.papel]} · saiu</p>
                    </div>
                  </div>
                  {gerencia && (
                    <Button variant="outline" size="sm" onClick={() => handleReativar(m)}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reativar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {membrosLoading && <LoadingSpinner message="" />}
      <div ref={sentinelRef} />
    </div>
  )
}

export default GerenciarMembros
