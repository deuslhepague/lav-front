export interface Subcategoria {
  nome: string
  categoria: string
  categoria_emoji: string
}

export interface Roupa {
  id: number
  nome: string
  raridade: string
  raridade_emoji: string
  file_id: string
  imagem_url: string | null
  quantidade: number
  nao_troco: boolean
  subcategorias: Subcategoria[]
  categoria: string
  categoria_emoji: string
  evento_emoji: string | null
  evento_nome: string | null
  tags: string[]
}

export interface ColecaoPage {
  roupas: Roupa[]
  total: number
  pagina: number
  total_paginas: number
  por_pagina: number
}

export interface SubcollectionItem {
  id: number
  nome: string
  banner_fid: string | null
  qtd_usuario: number
  total_banco: number
  pct: number
}

export interface Colecao {
  nome: string
  emoji: string
  subcategorias: SubcollectionItem[]
}

export interface Perfil {
  id: number
  username: string
  lavagens: number
  moedas: number
  cartas: number
  biografia: string
  consecutive_days: number
  dist_raridade: Record<string, number>
}

export interface Categoria {
  id: number
  nome: string
  emoji: string
}

export type Ordem = 'recente' | 'nome' | 'raridade'
