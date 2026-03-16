const MAP: Record<string, { text: string; cls: string }> = {
  diamante: { text: '💎 Diamante', cls: 'text-dia border-dia/40 bg-dia/10' },
  lendário: { text: '🥇 Lendário', cls: 'text-leg border-leg/40 bg-leg/10' },
  raro:     { text: '🥈 Raro',     cls: 'text-rar border-rar/40 bg-rar/10' },
  comum:    { text: '🥉 Comum',    cls: 'text-com border-com/40 bg-com/10' },
}

export default function RoupaBadge({ raridade }: { raridade: string }) {
  const key = raridade.toLowerCase()
  const m   = MAP[key] ?? { text: raridade, cls: 'text-muted border-border' }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${m.cls}`}>
      {m.text}
    </span>
  )
}
