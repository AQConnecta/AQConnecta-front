import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Loader2, MapPin, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Endereco } from '../../services/endpoints/endereco'
import { handleApiError } from '../../lib/errors'
import api from '../../services/api'

interface IModal {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  enderecoEdit: Endereco
  handleClose: () => void
}

type ViaCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
}

function EnderecoRegister({ isOpen, setOpen, enderecoEdit, handleClose }: IModal) {
  const [endereco, setEndereco] = useState<Endereco>(enderecoEdit || {
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    numeroCasa: '',
    complemento: '',
  })
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cepConsultado, setCepConsultado] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!enderecoEdit

  useEffect(() => {
    if (enderecoEdit) {
      setEndereco(enderecoEdit)
      setCepConsultado(true)
    } else {
      setEndereco({
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil',
        numeroCasa: '',
        complemento: '',
      })
      setCepConsultado(false)
    }
  }, [enderecoEdit, isOpen])

  function setEnderecoValue(value: string, field: string) {
    setEndereco((prev) => ({ ...prev, [field]: value }))
  }

  const buscarCep = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return

    setBuscandoCep(true)
    setCepConsultado(false)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data: ViaCepResponse = await response.json()

      if (data.erro) {
        toast.error('CEP não encontrado')
        setCepConsultado(false)
        return
      }

      setEndereco((prev) => ({
        ...prev,
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
        complemento: data.complemento || prev.complemento,
        pais: 'Brasil',
      }))
      setCepConsultado(true)
    } catch {
      toast.error('Erro ao consultar o CEP. Preencha manualmente.')
    } finally {
      setBuscandoCep(false)
    }
  }, [])

  function handleCepChange(value: string) {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 8) {
      setEnderecoValue(digits, 'cep')
      if (digits.length === 8) {
        buscarCep(digits)
      }
    }
  }

  async function submitEndereco() {
    setIsSubmitting(true)
    try {
      if (isEdit) {
        await api.endereco.alterarEndereco(endereco.id!, endereco)
        toast.success('Endereço editado com sucesso')
      } else {
        await api.endereco.cadastrarEndereco(endereco)
        toast.success('Endereço adicionado com sucesso')
      }
      handleClose()
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const camposObrigatoriosPreenchidos =
    endereco.cep.length >= 8
    && endereco.rua.length > 0
    && endereco.bairro.length > 0
    && endereco.cidade.length > 0
    && endereco.estado.length > 0
    && endereco.numeroCasa.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {isEdit ? 'Editar' : 'Adicionar'} endereço
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* CEP com busca automática */}
          <div className="space-y-1.5">
            <Label htmlFor="cep">CEP</Label>
            <div className="relative">
              <Input
                id="cep"
                placeholder="00000-000"
                value={formatCep(endereco.cep)}
                onChange={(e) => handleCepChange(e.target.value)}
                maxLength={9}
                className="pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {buscandoCep ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Search className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
            {buscandoCep && (
              <p className="text-xs text-primary animate-fadeIn">Buscando endereço...</p>
            )}
            {cepConsultado && !buscandoCep && (
              <p className="text-xs text-green-600 animate-fadeIn">Endereço encontrado via CEP</p>
            )}
          </div>

          {/* Estado e Cidade lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                placeholder="UF"
                value={endereco.estado}
                onChange={(e) => setEnderecoValue(e.target.value, 'estado')}
                maxLength={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Cidade"
                value={endereco.cidade}
                onChange={(e) => setEnderecoValue(e.target.value, 'cidade')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              placeholder="Bairro"
              value={endereco.bairro}
              onChange={(e) => setEnderecoValue(e.target.value, 'bairro')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rua">Rua</Label>
            <Input
              id="rua"
              placeholder="Logradouro"
              value={endereco.rua}
              onChange={(e) => setEnderecoValue(e.target.value, 'rua')}
            />
          </div>

          {/* Número e Complemento lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                placeholder="Nº"
                value={endereco.numeroCasa}
                onChange={(e) => {
                  const numero = e.target.value.replace(/\D/g, '')
                  setEnderecoValue(numero, 'numeroCasa')
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="complemento">
                Complemento <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="complemento"
                placeholder="Apto, bloco..."
                value={endereco.complemento}
                onChange={(e) => setEnderecoValue(e.target.value, 'complemento')}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!camposObrigatoriosPreenchidos || isSubmitting}
            onClick={submitEndereco}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </span>
            ) : (
              isEdit ? 'Salvar' : 'Adicionar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EnderecoRegister
