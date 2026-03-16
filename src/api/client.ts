// 🔧 Troque pela URL do seu Cloudflare Tunnel
export const API_BASE = import.meta.env.VITE_API_URL ?? 'https://SEU-TUNNEL.trycloudflare.com'

function getInitData(): string {
  return window.Telegram?.WebApp?.initData ?? ''
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'X-Telegram-Init-Data': getInitData(),
      ...(options?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

export function imgUrl(fileId: string): string {
  return `${API_BASE}/api/imagem/${encodeURIComponent(fileId)}`
}
