import { Roupa } from '../types'
import TgImage from './TgImage'

const RAR_COLOR: Record<string, string> = {
  diamante: 'text-dia',
  lendário: 'text-leg',
  raro:     'text-rar',
  comum:    'text-com',
}

interface Props {
  roupa: Roupa
  onClick: (r: Roupa) => void
  delay?: number
}

export default function RoupaItem({ roupa, onClick, delay = 0 }: Props) {
  const rarKey = (roupa.raridade ?? '').toLowerCase()
  const sub = roupa.subcategorias[0]?.nome ?? ''

  return (
    <button
      onClick={() => onClick(roupa)}
      className="w-full flex items-center gap-3 px-4 py-3 active:bg-s1 transition-colors
                 border-b border-border last:border-0 text-left fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <TgImage
        fileId={roupa.file_id}
        alt={roupa.nome}
        placeholder={roupa.evento_emoji ?? roupa.categoria_emoji ?? '👗'}
        className="w-12 h-12 rounded-xl flex-shrink-0 bg-s1"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-white font-medium text-[14px] truncate">{roupa.nome}</span>
          {roupa.nao_troco && (
            <span className="flex-shrink-0 text-[10px] font-semibold text-red border border-red/40
                             bg-redSoft px-1.5 py-0.5 rounded-full leading-none">
              Não Troco
            </span>
          )}
        </div>
        <p className="text-sub text-xs truncate">{sub}</p>
        <p className="text-xs mt-0.5 flex items-center gap-1">
          <span className={RAR_COLOR[rarKey] ?? 'text-sub'}>{roupa.raridade_emoji}</span>
          <span className="text-muted">{roupa.raridade}</span>
          <span className="text-muted/60">· ID: {roupa.id}</span>
        </p>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className={`text-sm font-medium ${roupa.quantidade > 1 ? 'text-acc' : 'text-sub'}`}>
          {roupa.quantidade > 1 ? `${roupa.quantidade}×` : '×1'}
        </span>
        <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </button>
  )
}
