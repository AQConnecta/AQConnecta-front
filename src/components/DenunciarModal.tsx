import { useState } from 'react'
import { toast } from 'sonner'
import api from '../services/api'
import { MotivoDenuncia, MOTIVO_LABELS, MOTIVO_OPTIONS } from '../services/endpoints/denuncia'
import { handleApiError } from '../lib/errors'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

function DenunciarModal({ idProjeto, isOpen, onClose }: { idProjeto: string; isOpen: boolean; onClose: () => void }) {
  const [motivo, setMotivo] = useState<MotivoDenuncia>('INFO_FALSA')
  const [descricao, setDescricao] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    if (motivo === 'OUTRO' && !descricao.trim()) {
      toast.warning('Descreva o motivo da denúncia.')
      return
    }
    setEnviando(true)
    try {
      await api.denuncia.denunciar(idProjeto, { motivo, descricao: descricao.trim() || undefined })
      toast.success('Denúncia registrada. Obrigado por reportar.')
      setDescricao('')
      onClose()
    } catch (err) {
      handleApiError(err, 'Erro ao enviar denúncia')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Denunciar projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="motivo">Motivo</Label>
            <Select value={motivo} onValueChange={(v) => setMotivo(v as MotivoDenuncia)}>
              <SelectTrigger id="motivo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOTIVO_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {MOTIVO_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição {motivo === 'OUTRO' ? '(obrigatória)' : '(opcional)'}</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Detalhe a denúncia..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={enviar} disabled={enviando}>
            Enviar denúncia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DenunciarModal
