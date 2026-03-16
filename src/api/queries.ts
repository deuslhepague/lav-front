import { apiFetch, API_BASE } from './client'
import type { Perfil, ColecaoPage, Colecao, Ordem } from '../types'

export const queries = {
  perfil: (uid: number) =>
    apiFetch<Perfil>(`/api/perfil/${uid}`),

  categorias: () =>
    fetch(`${API_BASE}/api/categorias`).then(r => r.json()),

  colecao: (uid: number, params: {
    pagina?: number
    ordem?: Ordem
    categoria?: string
    raridade?: string
    busca?: string
  }) => {
    const p = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') p.set(k, String(v))
    })
    return apiFetch<ColecaoPage>(`/api/colecao/${uid}?${p}`)
  },

  colecoes: (uid: number) =>
    apiFetch<Colecao[]>(`/api/colecoes/${uid}`),

  listaTroca: (uid: number) =>
    apiFetch<{ texto: string }>(`/api/lista_troca/${uid}`),

  toggleNaoTroco: (uid: number, roupaId: number) =>
    apiFetch<{ nao_troco: boolean }>(`/api/nao_troco/${uid}/${roupaId}`, { method: 'POST' }),
}
