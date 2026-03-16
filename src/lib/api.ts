// 🔧 Mude para a URL do seu Cloudflare Tunnel (ou defina VITE_API_URL no .env)
export const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'https://SEU-TUNNEL.trycloudflare.com'

function getInitData(): string {
  return (window as any).Telegram?.WebApp?.initData ?? ''
}

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: { 'X-Telegram-Init-Data': getInitData(), ...opts.headers },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export function imgUrl(fileId: string): string {
  return `${API_BASE}/api/imagem/${encodeURIComponent(fileId)}`
}

export const api = {
  perfil:         (uid: number) => apiFetch<any>(`/api/perfil/${uid}`),
  categorias:     () => fetch(`${API_BASE}/api/categorias`).then(r => r.json()),
  colecao:        (uid: number, params: Record<string, string | number>) =>
    apiFetch<any>(`/api/colecao/${uid}?${new URLSearchParams(
      Object.entries(params).filter(([,v]) => v !== '').map(([k,v]) => [k, String(v)])
    )}`),
  colecoes:       (uid: number) => apiFetch<any[]>(`/api/colecoes/${uid}`),
  listaTroca:     (uid: number) => apiFetch<{texto:string}>(`/api/lista_troca/${uid}`),
  toggleNaoTroco: (uid: number, id: number) =>
    apiFetch<{nao_troco:boolean}>(`/api/nao_troco/${uid}/${id}`, { method: 'POST' }),
}
