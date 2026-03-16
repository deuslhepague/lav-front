import { useEffect, useState } from 'react'
import { Colecao } from '../types'
import { api, imgUrl } from '../lib/api'

interface Props { userId: number }

export default function ColecoesTab({ userId }: Props) {
  const [colecoes, setColecoes] = useState<Colecao[]>([])
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    api.colecoes(userId)
      .then(d => { setColecoes(d); setLoaded(true) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId, loaded])

  if (loading) return <SkeletonColecoes />

  if (!colecoes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-sub">
        <span className="text-5xl">📚</span>
        <p className="text-sm">Nenhuma coleção ainda</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full pb-20">
      {colecoes.map(cat => (
        <div key={cat.nome} className="mb-5">
          {/* Category header */}
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-sub uppercase tracking-wider">
              {cat.emoji} {cat.nome}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Subcategory grid */}
          <div className="px-3 grid grid-cols-2 gap-3">
            {cat.subcategorias.map(sub => (
              <SubCard key={sub.id} sub={sub} catEmoji={cat.emoji} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SubCard({ sub, catEmoji }: { sub: Colecao['subcategorias'][0]; catEmoji: string }) {
  const [bannerLoaded, setBannerLoaded] = useState(false)
  const pct = sub.pct ?? 0
  const completo = pct >= 100

  return (
    <div className="bg-s0 rounded-ios-lg overflow-hidden border border-border fade-in">
      {/* Banner */}
      <div className="relative w-full aspect-video bg-s1 overflow-hidden">
        {sub.banner_fid ? (
          <>
            {!bannerLoaded && (
              <div className="absolute inset-0 shimmer" />
            )}
            <img
              src={imgUrl(sub.banner_fid)}
              alt={sub.nome}
              loading="lazy"
              onLoad={() => setBannerLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${bannerLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {catEmoji}
          </div>
        )}

        {/* Completo badge */}
        {completo && (
          <div className="absolute top-2 right-2 bg-green/90 text-white
                          text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            100%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-white text-[12px] font-semibold truncate mb-2">{sub.nome}</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-s2 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full bg-acc rounded-full grow-width"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-sub">
            <span className="text-white font-medium">{sub.qtd_usuario}</span>
            {' / '}{sub.total_banco}
          </span>
          <span className={`text-[10px] font-semibold ${completo ? 'text-green' : 'text-acc'}`}>
            {pct}%
          </span>
        </div>
      </div>
    </div>
  )
}

function SkeletonColecoes() {
  return (
    <div className="px-3 pt-4 pb-20">
      <div className="h-3 w-24 shimmer rounded mb-4 ml-1" />
      <div className="grid grid-cols-2 gap-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-s0 rounded-ios-lg overflow-hidden border border-border">
            <div className="aspect-video shimmer" />
            <div className="p-3">
              <div className="h-3 w-3/4 shimmer rounded mb-3" />
              <div className="h-1.5 w-full shimmer rounded mb-2" />
              <div className="h-2 w-1/2 shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
