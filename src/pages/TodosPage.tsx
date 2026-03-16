import { useState, useEffect, useCallback } from 'react'
import type { Roupa, Categoria, Ordem } from '../types'
import { api } from '../lib/api'
import { useTelegram } from '../hooks/useTelegram'
import RoupaItem from '../components/RoupaItem'
import RoupaModal from '../components/RoupaModal'

const RARIDADES = [
  { label: 'Todos', val: '' },
  { label: '💎', val: 'diamante' },
  { label: '🥇', val: 'lendário' },
  { label: '🥈', val: 'raro' },
  { label: '🥉', val: 'comum' },
]

interface Props {
  userId: number
  showToast: (msg: string) => void
}

export default function TodosPage({ userId, showToast }: Props) {
  const { haptic } = useTelegram()

  const [roupas, setRoupas]         = useState<Roupa[]>([])
  const [total, setTotal]           = useState(0)
  const [pagina, setPagina]         = useState(1)
  const [totalPag, setTotalPag]     = useState(1)
  const [loading, setLoading]       = useState(true)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cat, setCat]               = useState('')
  const [rar, setRar]               = useState('')
  const [busca, setBusca]           = useState('')
  const [buscaInput, setBuscaInput] = useState('')
  const [ordem, setOrdem]           = useState<Ordem>('recente')
  const [modalRoupa, setModalRoupa] = useState<Roupa | null>(null)

  useEffect(() => {
    api.categorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setBusca(buscaInput), 400)
    return () => clearTimeout(t)
  }, [buscaInput])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const d = await api.colecao(userId, { pagina, ordem, categoria: cat, raridade: rar, busca })
      setRoupas(d.roupas)
      setTotal(d.total)
      setTotalPag(d.total_paginas)
    } catch {
      showToast('Erro ao carregar roupas.')
    } finally {
      setLoading(false)
    }
  }, [userId, pagina, cat, rar, busca, ordem, showToast])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPagina(1) }, [cat, rar, busca, ordem])

  function handleToggleNaoTroco(id: number, val: boolean) {
    setRoupas(prev => prev.map(r => r.id === id ? { ...r, nao_troco: val } : r))
    setModalRoupa(prev => prev?.id === id ? { ...prev, nao_troco: val } : prev)
  }

  const grupos = roupas.reduce<Record<string, { emoji: string; roupas: Roupa[] }>>((acc, r) => {
    const g = r.categoria || 'outros'
    if (!acc[g]) acc[g] = { emoji: r.categoria_emoji || '📦', roupas: [] }
    acc[g].roupas.push(r)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Filters */}
      <div className="flex-shrink-0 bg-bg px-4 pt-3">
        <div className="flex items-center gap-2 bg-s0 border border-border rounded-ios px-3 py-2 mb-3">
          <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="search" value={buscaInput}
            onChange={e => setBuscaInput(e.target.value)}
            placeholder="Buscar roupa..."
            className="bg-transparent outline-none text-white text-sm w-full placeholder:text-muted"
          />
          {buscaInput && (
            <button onClick={() => setBuscaInput('')} className="text-muted text-xl leading-none">×</button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3">
          <Chip label="Todos" active={cat === ''} onClick={() => setCat('')} />
          {categorias.map(c => (
            <Chip key={c.id} label={`${c.emoji} ${c.nome}`}
              active={cat === c.nome.toLowerCase()} onClick={() => setCat(c.nome.toLowerCase())} />
          ))}
        </div>

        <div className="flex items-center gap-2 pb-3">
          <div className="flex gap-1.5 flex-1 overflow-x-auto">
            {RARIDADES.map(r => (
              <Chip key={r.val} label={r.label} active={rar === r.val} onClick={() => setRar(r.val)} />
            ))}
          </div>
          <select
            value={ordem} onChange={e => setOrdem(e.target.value as Ordem)}
            className="flex-shrink-0 bg-s0 border border-border text-sub text-xs rounded-lg px-2 py-1.5 outline-none"
          >
            <option value="recente">Recentes</option>
            <option value="nome">A–Z</option>
            <option value="raridade">Raridade</option>
          </select>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-2">
        <span className="text-sub text-xs">
          <span className="text-white font-medium">{total.toLocaleString('pt-BR')}</span> roupas
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <SkeletonList />
        ) : roupas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-sub gap-3">
            <span className="text-5xl">🧺</span>
            <p className="text-sm">Nenhuma roupa encontrada</p>
          </div>
        ) : (
          <div className="pb-20">
            {Object.entries(grupos).map(([catNome, g]) => (
              <div key={catNome}>
                <div className="sticky top-0 z-10 bg-bg/90 backdrop-blur-sm px-4 py-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-sub uppercase tracking-wider">
                    {g.emoji} {catNome.charAt(0).toUpperCase() + catNome.slice(1)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="bg-s0 mx-3 rounded-ios overflow-hidden border border-border mb-3">
                  {g.roupas.map((r, i) => (
                    <RoupaItem key={r.id} roupa={r} delay={Math.min(i * 20, 200)}
                      onClick={r => { haptic(); setModalRoupa(r) }} />
                  ))}
                </div>
              </div>
            ))}

            {totalPag > 1 && (
              <div className="flex items-center justify-center gap-4 py-4">
                <button disabled={pagina <= 1} onClick={() => setPagina(p => p - 1)}
                  className="text-acc text-sm font-medium disabled:text-muted">← Anterior</button>
                <span className="text-sub text-xs">{pagina} / {totalPag}</span>
                <button disabled={pagina >= totalPag} onClick={() => setPagina(p => p + 1)}
                  className="text-acc text-sm font-medium disabled:text-muted">Próxima →</button>
              </div>
            )}
          </div>
        )}
      </div>

      <RoupaModal
        roupa={modalRoupa}
        onClose={() => setModalRoupa(null)}
        onToggleNaoTroco={handleToggleNaoTroco}
        showToast={showToast}
      />
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
        active ? 'bg-acc text-white border-acc' : 'bg-transparent text-sub border-border'
      }`}>
      {label}
    </button>
  )
}

function SkeletonList() {
  return (
    <div className="mx-3 bg-s0 rounded-ios overflow-hidden border border-border">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
          <div className="w-12 h-12 rounded-xl shimmer flex-shrink-0" />
          <div className="flex-1">
            <div className="h-3.5 w-2/3 shimmer rounded mb-2" />
            <div className="h-2.5 w-1/2 shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
