import { useState, useCallback } from 'react'

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)

  const show = useCallback((text: string, duration = 2200) => {
    setMsg(text)
    setTimeout(() => setMsg(null), duration)
  }, [])

  return { msg, show }
}
