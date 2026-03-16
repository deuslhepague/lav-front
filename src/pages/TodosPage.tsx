import { useState, useEffect, useCallback, useRef } from 'react'
import type { Roupa, Categoria, ColecaoPage, Ordem } from '../types'
import { getCategorias, getColecao } from '../api/queries'
import TgImage from '../components/TgImage'
import { SkeletonItem } from '../components/Skeleton'
import RoupaModal from '../components/RoupaModal'
import { toggleNaoTroco } from '../api/queries'
import { useToast } from '../hooks/useToast'
import { useTelegram } from '../hooks/useTelegram'

const RAR_COLOR: Record<string, string> = {
  diamante: 'text-dia',
  lendário: 'text-leg',
  raro:     'text-rar',
  comum:    'text-com',
}

interface Props { uid: number }

export default function TodosPage({ uid }: Props) {
  const { haptic } = useTelegram()
  const { msg: toastMsg, show: showToast } = useToast()

  const [cats, setCats]     = useState<Categoria[]>([])
  const [data, setData]     = useState<ColecaoPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  const [cat,   setCat]   = useState('')
  const [rar,   setRar]   = useState('')
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState<Ordem>('recente')
  const [pagina, setPagina] = useState(1)

  const [modalRoupa, setModalRoupa] = useState<Roupa | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const buscaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load categories once
  useEffect(() => {
    getCategorias().then(setCats).catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const d = await getColecao({ uid, pagina, categoria: cat, raridade: rar, busca, ordem })
      setData(d)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [uid, pagina, cat, rar, busca, ordem])

  useEffect(() => { load() }, [load])

  // Group roupas by category
  const grouped = (() => {
    if (!data?.roupas.length) return []
    const map = new Map<string, { emoji: string; roupas: Roupa[] }>()
    data.roupas.forEach(r => {
      const key = r.categoria || 'outros'
      if (!map.has(key)) map.set(key, { emoji: r.categoria_emoji || '📦', roupas: [] })
      map.get(key)!.roupas.push(r)
    })
    return Array.from(map.entries())
  })()

  const handleBusca = (v: string) => {
    if (buscaTimer.current) clearTimeout(buscaTimer.current)
    buscaTimer.current = setTimeout(() => {
      setBusca(v)
      setPagina(1)
    }, 380)
  }

  const handleToggleNT = async (roupa: Roupa) => {
    setToggling(true)
    try {
      const res = await toggleNaoTroco(uid, roupa.id)
      haptic('light')
      // Update in-place
      if (data) {
        const updated = data.roupas.map(r =>
          r.id === roupa.id ? { ...r, nao_troco: res.nao_troco } : r
        )
        setData({ ...data, roupas: updated })
      }
      if (modalRoupa?.id === roupa.id) {
        setModalRoupa({ ...roupa, nao_troco: res.nao_troco })
      }
      showToast(res.nao_troco ? '🚫 Marcado como não troco' : '✅ Removido do não troco')
    } catch {
      showToast('Erro ao atualizar.')
    } finally {
      setToggling(false)
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="flex-shrink-0 bg-bg">
        <div className="px-4 pt-3 pb-1 flex items-center gap-2.5 bg-surface border-b border-border">
          <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search"
            placeholder="Buscar roupa..."
            className="bg-transparent outline-none text-sm text-label placeholder:text-muted w-full py-2"
            onChange={e => handleBusca(e.target.value)}
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
          {[{ id: 0, nome: '', emoji: '' }, ...cats].map((c, i) => (
            <button
              key={i}
              onClick={() => { setCat(c.nome.toLowerCase()); setPagina(1) }}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all
                ${cat === c.nome.toLowerCase()
                  ? 'bg-acc border-acc text-bg font-semibold'
                  : 'border-border text-muted'}`}
            >
              {c.nome ? `${c.emoji} ${c.nome}` : 'Todos'}
            </button>
          ))}
        </div>

        {/* Raridade chips */}
        <div className="flex gap-2 px-4 pb-2.5 overflow-x-auto scrollbar-none border-b border-border">
          {[
            { v: '',         l: 'Todas' },
            { v: 'diamante', l: '💎' },
            { v: 'lendário', l: '🥇' },
            { v: 'raro',     l: '🥈' },
            { v: 'comum',    l: '🥉' },
          ].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => { setRar(v); setPagina(1) }}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all
                ${rar === v
                  ? 'bg-acc border-acc text-bg font-semibold'
                  : 'border-border text-muted'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-muted">
            <span className="text-label font-medium">{data?.total.toLocaleString('pt-BR') ?? '–'}</span> roupas
          </span>
          <select
            value={ordem}
            onChange={e => { setOrdem(e.target.value as Ordem); setPagina(1) }}
            className="text-xs bg-raised border border-border text-label rounded-lg px-2 py-1.5 outline-none"
          >
            <option value="recente">Recentes</option>
            <option value="nome">A–Z</option>
            <option value="raridade">Raridade</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto ios-bounce scrollbar-none">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonItem key={i} />)
        ) : !data?.roupas.length ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted text-sm">
            <span className="text-4xl">🧺</span>
            <span>Nenhuma roupa encontrada.</span>
          </div>
        ) : (
          <>
            {grouped.map(([catNome, g]) => (
              <div key={catNome}>
                {/* Group header */}
                <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-bg/95 backdrop-blur-sm">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {g.emoji} {catNome.charAt(0).toUpperCase() + catNome.slice(1)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Items */}
                {g.roupas.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => { setModalRoupa(r); haptic() }}
                    className="w-full flex items-center gap-3 px-4 py-3 active:bg-surface
                      border-b border-surface text-left fade-up"
                    style={{ animationDelay: `${Math.min(i * 20, 250)}ms` }}
                  >
                    {/* Thumbnail */}
                    <TgImage
                      fileId={r.file_id}
                      alt={r.nome}
                      placeholder={r.evento_emoji ?? r.categoria_emoji}
                      className="w-12 h-12 rounded-xl flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-label truncate">{r.nome}</p>
                      <p className="text-xs text-muted truncate mt-0.5">
                        {r.subcategorias[0]?.nome ?? ''}
                      </p>
                      <p className="text-xs mt-1 flex items-center gap-1.5">
                        <span className={RAR_COLOR[r.raridade.toLowerCase()] ?? 'text-muted'}>
                          {r.raridade_emoji}
                        </span>
                        <span className="text-sub">{r.raridade}</span>
                        <span className="text-muted">(ID: {r.id})</span>
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`text-xs font-medium ${r.quantidade > 1 ? 'text-acc' : 'text-muted'}`}>
                        {r.quantidade > 1 ? `${r.quantidade}x` : 'x1'}
                      </span>
                      {r.nao_troco && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                          border border-red/50 text-red bg-red/10">
                          Não Troco
                        </span>
                      )}
                      <svg className="w-3 h-3 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            ))}

            {/* Pagination */}
            {(data?.total_paginas ?? 1) > 1 && (
              <div className="flex items-center justify-center gap-4 py-5">
                <button
                  onClick={() => { setPagina(p => p - 1); scrollRef.current?.scrollTo({ top: 0 }) }}
                  disabled={pagina <= 1}
                  className="text-sm px-4 py-2 rounded-xl bg-raised border border-border text-label disabled:opacity-30"
                >
                  ← Anterior
                </button>
                <span className="text-xs text-muted">{pagina} / {data?.total_paginas}</span>
                <button
                  onClick={() => { setPagina(p => p + 1); scrollRef.current?.scrollTo({ top: 0 }) }}
                  disabled={pagina >= (data?.total_paginas ?? 1)}
                  className="text-sm px-4 py-2 rounded-xl bg-raised border border-border text-label disabled:opacity-30"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <RoupaModal
        roupa={modalRoupa}
        onClose={() => setModalRoupa(null)}
        onToggleNaoTroco={handleToggleNT}
        loading={toggling}
      />

      {/* Toast */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50
        bg-raised border border-border rounded-xl px-4 py-2.5
        text-sm text-label whitespace-nowrap shadow-xl pointer-events-none
        transition-all duration-250
        ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        {toastMsg}
      </div>
    </>
  )
}
