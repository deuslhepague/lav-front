export function useTelegram() {
  const tg = (window as any).Telegram?.WebApp
  const user = tg?.initDataUnsafe?.user ?? null
  return {
    tg,
    user,
    userId: user?.id as number | null,
    firstName: user?.first_name as string | null,
    haptic: (type: 'light'|'medium'|'heavy' = 'light') =>
      tg?.HapticFeedback?.impactOccurred(type),
    close: () => tg?.close(),
  }
}
