export const API_BASE = import.meta.env.VITE_API_URL

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

export function imgUrl(fileId: string): string {
  return `${API_BASE}/api/imagem/${encodeURIComponent(fileId)}`
}
