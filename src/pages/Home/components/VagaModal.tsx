import { useEffect, useState, useRef, useCallback } from 'react'
import { X, Loader2, MapPin, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { Switch } from '../../../components/ui/switch'
import { Badge } from '../../../components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { PartialVaga, Vaga } from '../../../services/endpoints/vaga'
import { ProjetoResumo } from '../../../services/endpoints/projeto'
import { handleApiError } from '../../../lib/errors'
import api from '../../../services/api'
import { Competencia, AreaAtuacao, AREA_ATUACAO_OPTIONS, AREA_ATUACAO_LABELS } from '../../../services/endpoints/competencia'

type VagaModalProps = {
  isOpen: boolean
  handleClose: () => void
  editObj?: Vaga | null
}

type IbgeCidade = {
  nome: string
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla: string
      }
    }
  }
}

const vagaDefaultValues: PartialVaga = {
  titulo: '',
  descricao: '',
  localDaVaga: '',
  aceitaRemoto: false,
  dataLimiteCandidatura: '',
  iniciante: false,
}

function VagaModal(props: VagaModalProps) {
  const { isOpen, handleClose, editObj } = props

  const formattedEditObj = editObj ? {
    ...editObj,
    idProjeto: editObj.projetoId,
    areaAtuacao: editObj.areaAtuacao,
    dataLimiteCandidatura: typeof editObj.dataLimiteCandidatura === 'string'
      ? editObj.dataLimiteCandidatura.split('T')[0]
      : new Date(editObj.dataLimiteCandidatura).toISOString().split('T')[0],
  } : null

  const [vaga, setVaga] = useState<Vaga>(formattedEditObj || vagaDefaultValues as Vaga)
  const [competenciasList, setCompetenciasList] = useState<Competencia[]>([])
  const [competencias, setCompetencias] = useState<Competencia[]>(editObj?.competencias || [])
  const [search, setSearch] = useState('')
  const [reload, setReload] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([])
  const [sugestoesArea, setSugestoesArea] = useState<Competencia[]>([])
  const isEdit = !!editObj

  useEffect(() => {
    api.projeto.listarMeus().then((res) => setProjetos(res.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!vaga.areaAtuacao) {
      setSugestoesArea([])
      return
    }
    let cancelled = false
    api.competencia
      .sugestoesPorArea(vaga.areaAtuacao)
      .then((res) => { if (!cancelled) setSugestoesArea(res.data.data || []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [vaga.areaAtuacao])

  // --- Autocomplete de cidades ---
  const [cidadeQuery, setCidadeQuery] = useState(editObj?.localDaVaga || '')
  const [cidadeSugestoes, setCidadeSugestoes] = useState<IbgeCidade[]>([])
  const [buscandoCidade, setBuscandoCidade] = useState(false)
  const [showSugestoes, setShowSugestoes] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const buscarCidades = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCidadeSugestoes([])
      return
    }
    setBuscandoCidade(true)
    try {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`,
      )
      const todas: IbgeCidade[] = await res.json()
      const filtradas = todas
        .filter((c) => c.nome.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
      setCidadeSugestoes(filtradas)
      setShowSugestoes(filtradas.length > 0)
    } catch {
      setCidadeSugestoes([])
    } finally {
      setBuscandoCidade(false)
    }
  }, [])

  function handleCidadeChange(value: string) {
    setCidadeQuery(value)
    setVagaValue(value, 'localDaVaga')
    setShowSugestoes(false)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      buscarCidades(value)
    }, 300)
  }

  function selecionarCidade(cidade: IbgeCidade) {
    const uf = cidade.microrregiao?.mesorregiao?.UF?.sigla
    const texto = uf ? `${cidade.nome} - ${uf}` : cidade.nome
    setCidadeQuery(texto)
    setVagaValue(texto, 'localDaVaga')
    setShowSugestoes(false)
    setCidadeSugestoes([])
  }

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSugestoes(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // --- Restante do form ---
  function setVagaValue(value: string | boolean, field: string) {
    setVaga((prev) => ({ ...prev, [field]: value }))
  }

  function clearFields() {
    setVaga(vagaDefaultValues as Vaga)
    setCompetencias([])
    setCidadeQuery('')
    setCidadeSugestoes([])
  }

  function onClose() {
    clearFields()
    handleClose()
  }

  async function handleSubmitForm() {
    setIsSubmitting(true)
    try {
      if (isEdit) {
        const vagaResponse = await api.vaga.alterarVaga(editObj?.id!, {
          ...vaga,
          atualizadoEm: new Date().toISOString(),
          dataLimiteCandidatura: `${vaga.dataLimiteCandidatura}T00:00:00`,
        })
        await api.competencia.linkCompetenciaVaga({
          competencias,
          idVaga: vagaResponse.data.data.id,
        })
        toast.success('Vaga editada com sucesso')
        onClose()
        return
      }
      const vagaResponse = await api.vaga.cadastrarVaga({
        ...vaga,
        atualizadoEm: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
        dataLimiteCandidatura: `${vaga.dataLimiteCandidatura}T00:00:00`,
      })
      const vagaId = vagaResponse.data.data.id
      await api.competencia.linkCompetenciaVaga({ competencias, idVaga: vagaId })
      toast.success('Vaga criada com sucesso')
      onClose()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadCompetencias() {
      try {
        const competenciasListRaw = await api.competencia.listAll(search, 0, 100)
        if (!cancelled) setCompetenciasList(competenciasListRaw.data.data)
      } catch (error) {
        if (!cancelled) {
          handleApiError(error, 'Erro ao carregar competências')
          setReload((prev) => prev + 1)
        }
      }
    }
    loadCompetencias()
    return () => { cancelled = true }
  }, [search, reload])

  function toggleCompetencia(competencia: Competencia) {
    const exists = competencias.find((c) => c.id === competencia.id)
    if (exists) {
      setCompetencias(competencias.filter((c) => c.id !== competencia.id))
    } else {
      setCompetencias([...competencias, competencia])
    }
  }

  async function handleSugerir() {
    const desc = search.trim()
    if (!desc) return
    try {
      await api.competencia.sugerir({ descricao: desc, categoria: vaga.areaAtuacao })
      toast.success('Competência enviada para aprovação dos administradores.')
      setSearch('')
    } catch (error) {
      handleApiError(error, 'Erro ao sugerir competência')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar vaga' : 'Nova vaga'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Título da vaga"
                value={vaga.titulo}
                onChange={(e) => setVagaValue(e.target.value, 'titulo')}
              />
            </div>

            {/* Campo cidade com autocomplete IBGE */}
            <div className="space-y-2" ref={containerRef}>
              <Label htmlFor="local">Cidade</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="local"
                  placeholder="Digite a cidade..."
                  value={cidadeQuery}
                  onChange={(e) => handleCidadeChange(e.target.value)}
                  onFocus={() => {
                    if (cidadeSugestoes.length > 0) setShowSugestoes(true)
                  }}
                  className="pl-9"
                  autoComplete="off"
                />
                {buscandoCidade && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                )}

                {showSugestoes && cidadeSugestoes.length > 0 && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg max-h-[200px] overflow-y-auto animate-slideDown">
                    {cidadeSugestoes.map((cidade, i) => {
                      const uf = cidade.microrregiao?.mesorregiao?.UF?.sigla
                      return (
                        <button
                          key={`${cidade.nome}-${uf}-${i}`}
                          type="button"
                          className="w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2 border-b border-border/50 last:border-0"
                          onClick={() => selecionarCidade(cidade)}
                        >
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span>
                            {cidade.nome}
                            {uf && <span className="text-muted-foreground ml-1">- {uf}</span>}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição da vaga"
              value={vaga.descricao}
              onChange={(e) => setVagaValue(e.target.value, 'descricao')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projeto">Projeto vinculado (opcional)</Label>
            <Select
              value={vaga.idProjeto || 'none'}
              onValueChange={(v) => setVaga((prev) => ({ ...prev, idProjeto: v === 'none' ? undefined : v }))}
            >
              <SelectTrigger id="projeto">
                <SelectValue placeholder="Nenhum">
                  {projetos.find((p) => p.id === vaga.idProjeto)?.titulo || 'Nenhum'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {projetos.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="dataLimite">Data limite para candidatura</Label>
              <Input
                id="dataLimite"
                type="date"
                value={vaga.dataLimiteCandidatura.toString()}
                onChange={(e) => setVagaValue(e.target.value, 'dataLimiteCandidatura')}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="remoto">Aceita remoto</Label>
                <Switch
                  id="remoto"
                  checked={vaga.aceitaRemoto}
                  onCheckedChange={(checked) => setVagaValue(checked, 'aceitaRemoto')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="iniciante">Vaga para iniciantes</Label>
                <Switch
                  id="iniciante"
                  checked={vaga.iniciante}
                  onCheckedChange={(checked) => setVagaValue(checked, 'iniciante')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaAtuacao">Área de atuação</Label>
            <Select
              value={vaga.areaAtuacao || 'none'}
              onValueChange={(v) => setVaga((prev) => ({ ...prev, areaAtuacao: v === 'none' ? undefined : (v as AreaAtuacao) }))}
            >
              <SelectTrigger id="areaAtuacao">
                <SelectValue placeholder="Selecione a área">
                  {vaga.areaAtuacao ? AREA_ATUACAO_LABELS[vaga.areaAtuacao] : 'Selecione a área'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                {AREA_ATUACAO_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {AREA_ATUACAO_LABELS[a]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchCompetencia">Competências relacionadas</Label>
            <Input
              id="searchCompetencia"
              placeholder="Digite para filtrar as competências"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search.trim().length >= 2 &&
              !competenciasList.some((c) => c.descricao.toLowerCase() === search.trim().toLowerCase()) && (
                <Button type="button" variant="outline" size="sm" className="mt-1" onClick={handleSugerir}>
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Sugerir "{search.trim()}" como nova competência
                </Button>
              )}

            {vaga.areaAtuacao && sugestoesArea.filter((s) => !competencias.find((c) => c.id === s.id)).length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Mais usadas em {AREA_ATUACAO_LABELS[vaga.areaAtuacao]}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sugestoesArea
                    .filter((s) => !competencias.find((c) => c.id === s.id))
                    .slice(0, 5)
                    .map((s) => (
                      <Badge
                        key={s.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent bg-purple-50 text-purple-700 border-purple-200"
                        onClick={() => toggleCompetencia(s)}
                      >
                        {s.descricao}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {competencias.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {competencias.map((comp) => (
                  <Badge
                    key={comp.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleCompetencia(comp)}
                  >
                    {comp.descricao}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            <div className="max-h-[150px] overflow-y-auto border rounded-md p-2 mt-2">
              <div className="flex flex-wrap gap-2">
                {competenciasList
                  .filter((c) => !competencias.find((sel) => sel.id === c.id))
                  .map((competencia) => (
                    <Badge
                      key={competencia.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleCompetencia(competencia)}
                    >
                      {competencia.descricao}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitForm} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </span>
            ) : (
              isEdit ? 'Editar' : 'Criar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VagaModal
