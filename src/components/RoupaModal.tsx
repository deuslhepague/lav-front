import { useState } from 'react'
import { Roupa } from '../types'
import TgImage from './TgImage'
import { api } from '../lib/api'
import { useTelegram } from '../hooks/useTelegram'

const RAR_STYLES: Record<string, string> = {
  diamante: 'text-dia border-dia/40 bg-dia/10',
  lendário: 'text-leg border-leg/40 bg-leg/10',
  raro:     'text-rar border-rar/40 bg-rar/10',
  comum:    'text-com border-com/40 bg-com/10',
}

interface Props {
  roupa: Roupa | null
  onClose: () => void
  onToggleNaoTroco: (id: number, val: boolean) => void
  showToast: (msg: string) => void
  isOwner?: boolean
}

export default function RoupaModal({ roupa, onClose, onToggleNaoTroco, showToast, isOwner = true }: Props) {
  const { userId, haptic } = useTelegram()
  const [loading, setLoading] = useState(false)
  const open = roupa !== null

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  async function toggleNT() {
    if (!roupa || !userId || loading) return
    setLoading(true)
    haptic('medium')
    try {
      const res = await api.toggleNaoTroco(userId, roupa.id)
      onToggleNaoTroco(roupa.id, res.nao_troco)
      showToast(res.nao_troco ? '🚫 Marcado como não troco' : '✅ Removido do não troco')
    } catch {
      showToast('Erro ao atualizar.')
    } finally {
      setLoading(false)
    }
  }

  const rarKey = (roupa?.raridade ?? '').toLowerCase()
  const rarStyle = RAR_STYLES[rarKey] ?? RAR_STYLES.comum

  return (
    <div
      onClick={handleBackdrop}
      className={`fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm
                  transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className={`w-full bg-s0 rounded-t-[28px] pb-8 max-h-[88vh] overflow-y-auto
                       ${open ? 'slide-up' : ''}`}>
        <div className="flex justify-center pt-3 pb-4">
          <div className="w-10 h-1 bg-s2 rounded-full" />
        </div>

        {roupa && (
          <div className="px-5">
            <div className="flex gap-4 mb-5">
              <TgImage
                fileId={roupa.file_id}
                alt={roupa.nome}
                placeholder={roupa.evento_emoji ?? roupa.categoria_emoji ?? '👗'}
                className="w-[100px] flex-shrink-0 rounded-ios aspect-[2/3] bg-s1"
              />

              <div className="flex-1 min-w-0 pt-1">
                <h2 className="text-white font-bold text-[20px] leading-tight mb-1">{roupa.nome}</h2>
                <p className="text-sub text-sm mb-3 leading-relaxed">
                  {roupa.subcategorias.map(s => s.nome).join(' · ')}
                </p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold
                                  px-2.5 py-1 rounded-full border ${rarStyle}`}>
                  {roupa.raridade_emoji} {roupa.raridade}
                </span>
                {roupa.evento_nome && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-acc
                                  bg-accSoft px-2.5 py-1 rounded-full border border-acc/30">
                    {roupa.evento_emoji} {roupa.evento_nome}
                  </div>
                )}
                <p className="text-sub text-sm mt-3">
                  Você tem <span className="text-white font-semibold">{roupa.quantidade}×</span>
                </p>
              </div>
            </div>

            {roupa.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {roupa.tags.map(tag => (
                  <span key={tag} className="text-xs text-acc bg-accSoft border border-acc/20 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {isOwner && <button
              onClick={toggleNT}
              disabled={loading}
              className={`w-full py-3.5 rounded-ios font-semibold text-sm
                          flex items-center justify-center gap-2 transition-all duration-200
                          active:scale-[0.98] ${roupa.nao_troco
                            ? 'bg-redSoft text-red border border-red/30'
                            : 'bg-s1 text-white border border-border'
                          } ${loading ? 'opacity-50' : ''}`}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                : roupa.nao_troco
                  ? <><span>✅</span> Marcado como "Não troco"</>
                  : <><span>🚫</span> Marcar como "Não troco"</>
              }
            </button>
            }<p className="text-center text-muted text-xs mt-4">ID: {roupa.id}</p>
          </div>
        )}
      </div>
    </div>
  )
}
