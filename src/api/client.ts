export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://SEU-NOVO-IP-COM-HIFENS.nip.io'

export function getInitData(): string {
  return window.Telegram?.WebApp?.initData ?? ''
}

export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: {
      'X-Telegram-Init-Data': getInitData(),
      ...opts.headers,
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

const _urlCache = new Map<string, { url: string; ts: number }>()
const URL_TTL = 2800_000 // ~46 min

export async function imgUrl(fileId: string): Promise<string> {
  if (!fileId) return ''

  const cached = _urlCache.get(fileId)
  if (cached && Date.now() - cached.ts < URL_TTL) {
    return cached.url
  }

  try {
    const data = await apiFetch<{ url: string }>(`/api/imagem/${encodeURIComponent(fileId)}`)
    _urlCache.set(fileId, { url: data.url, ts: Date.now() })
    return data.url
  } catch {
    return ''
  }
}
