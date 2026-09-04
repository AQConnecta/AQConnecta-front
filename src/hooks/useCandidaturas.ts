import { useEffect, useState } from 'react'
import api from '../services/api'
import { Vaga } from '../services/endpoints/vaga'

let cache: Set<string> | null = null
let inflight: Promise<Set<string>> | null = null
let cacheUserId: string | null = null
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function load(userId?: string): Promise<Set<string>> {
  if (userId && cacheUserId !== userId) {
    cache = null
    inflight = null
  }
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    cacheUserId = userId ?? null
    inflight = api.perfil
      .listarMinhasCandidaturas()
      .then((res) => {
        const vagas: Vaga[] = res.data?.data ?? []
        cache = new Set(vagas.map((v) => v.id).filter((id): id is string => !!id))
        return cache
      })
      .catch(() => {
        cache = new Set<string>()
        return cache
      })
  }
  return inflight
}

export function marcarCandidatado(vagaId: string) {
  if (!cache) cache = new Set<string>()
  cache.add(vagaId)
  notify()
}

export function useJaCandidatado(vagaId?: string, userId?: string): boolean {
  const [aplicado, setAplicado] = useState<boolean>(() => !!(vagaId && cache?.has(vagaId)))

  useEffect(() => {
    let active = true
    const update = () => {
      if (active) setAplicado(!!(vagaId && cache?.has(vagaId)))
    }
    listeners.add(update)
    // Sem usuário logado (navegação pública) não buscamos candidaturas,
    // evitando 401 que dispara o redirect global para /login.
    if (userId) {
      load(userId).then(update)
    }
    return () => {
      active = false
      listeners.delete(update)
    }
  }, [vagaId, userId])

  return aplicado
}
