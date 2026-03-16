import { apiFetch } from './client'
import type { Perfil, ColecaoPage, CatColecao, Categoria, Roupa } from '../types'

export const getPerfil = (uid: number) =>
  apiFetch<Perfil>(`/api/perfil/${uid}`)

export const getCategorias = () =>
  apiFetch<Categoria[]>(`/api/categorias`)

export interface ColecaoParams {
  uid: number
  pagina?: number
  categoria?: string
  raridade?: string
  busca?: string
  ordem?: string
}

export const getColecao = ({ uid, pagina = 1, categoria, raridade, busca, ordem = 'recente' }: ColecaoParams) => {
  const p = new URLSearchParams({ pagina: String(pagina), ordem })
  if (categoria) p.set('categoria', categoria)
  if (raridade)  p.set('raridade', raridade)
  if (busca)     p.set('busca', busca)
  return apiFetch<ColecaoPage>(`/api/colecao/${uid}?${p}`)
}

export const getColecoes = (uid: number) =>
  apiFetch<CatColecao[]>(`/api/colecoes/${uid}`)

export const getListaTroca = (uid: number) =>
  apiFetch<{ texto: string }>(`/api/lista_troca/${uid}`)

export const toggleNaoTroco = (uid: number, roupaId: number) =>
  apiFetch<{ nao_troco: boolean }>(`/api/nao_troco/${uid}/${roupaId}`, { method: 'POST' })
