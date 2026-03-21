import { useState, useEffect } from 'react'
import { useTelegram } from './hooks/useTelegram'
import { api } from './lib/api'
import RoupasTab from './components/RoupasTab'
import ColecoesTab from './components/ColecoesTab'
import Toast from './components/Toast'

type Tab = 'roupas' | 'colecoes'

export default function App() {
  const { userId: myUserId, firstName: myFirstName, tg } = useTelegram()
  const [tab, setTab] = useState<Tab>('roupas')
  const [perfil, setPerfil] = useState<any>(null)
  const [toast, setToast] = useState('')

  // Descobrir qual usuário exibir:
  // 1. startapp parameter do link (t.me/bot/app?startapp=USER_ID)
  // 2. usuário logado no Telegram
  const startApp = tg?.initDataUnsafe?.start_param
  const targetUserId: number | null = startApp
    ? (parseInt(startApp as string) || null)
    : myUserId

  const isOwnProfile = targetUserId === myUserId

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    if (!targetUserId) return
    api.perfil(targetUserId).then(setPerfil).catch(() => {})
  }, [targetUserId])

  useEffect(() => {
    if (!tg) return
    tg.BackButton.onClick(() => tg.close())
    tg.BackButton.show()
    return () => tg.BackButton.hide()
  }, [tg])

  // Nome a exibir: perfil do banco ou nome do Telegram
  const nome = isOwnProfile
    ? (myFirstName ?? perfil?.username ?? '–')
    : (perfil?.username ?? `User ${targetUserId}`)

  const cartas = perfil?.cartas ?? 0
  const moedas = perfil?.moedas ?? 0

  async function copiarLista() {
    if (!targetUserId) return
    try {
      const d = await api.listaTroca(targetUserId)
      await navigator.clipboard.writeText(d.texto)
      showToast('✅ Lista copiada!')
      tg?.HapticFeedback?.notificationOccurred('success')
    } catch {
      showToast('Erro ao copiar lista.')
    }
  }

  if (!targetUserId) {
    return (
      <div className="h-screen bg-bg flex items-center justify-center text-center px-8">
        <div>
          <div className="text-5xl mb-4">👗</div>
          <p className="text-white font-semibold text-lg mb-2">Lavanderia</p>
          <p className="text-sub text-sm">Abra este app pelo Telegram</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-s0 border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-acc to-purple-400
                        flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {nome[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {nome}
            {!isOwnProfile && (
              <span className="ml-2 text-xs text-acc font-normal">coleção alheia</span>
            )}
          </p>
          <p className="text-sub text-xs mt-0.5">
            {cartas.toLocaleString('pt-BR')} roupas · {moedas.toLocaleString('pt-BR')} moedas
          </p>
        </div>
        {/* Botão copiar só aparece na própria coleção */}
        {isOwnProfile && (
          <button
            onClick={copiarLista}
            className="flex-shrink-0 flex items-center gap-1.5 bg-accSoft text-acc
                       text-xs font-semibold px-3 py-2 rounded-full active:opacity-60 transition-opacity"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copiar lista de troca
          </button>
        )}
      </header>

      {/* Segmented control */}
      <div className="flex-shrink-0 bg-s0 px-4 pb-3">
        <div className="bg-s1 rounded-xl p-1 flex gap-1">
          {([['roupas','🧺 Roupas'],['colecoes','📚 Coleções']] as [Tab,string][]).map(([t,label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                tab === t ? 'bg-s2 text-white shadow-sm' : 'text-sub'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'roupas'
          ? <RoupasTab userId={targetUserId} showToast={showToast} isOwner={isOwnProfile} />
          : <ColecoesTab userId={targetUserId} />}
      </div>

      <Toast message={toast} />
    </div>
  )
}
