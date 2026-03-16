export function useTelegram() {
  const tg = window.Telegram?.WebApp ?? null
  const user = tg?.initDataUnsafe?.user ?? null
  return {
    tg,
    user,
    userId:    user?.id ?? null,
    firstName: user?.first_name ?? null,
    haptic: (type: 'light' | 'medium' | 'heavy' = 'light') =>
      tg?.HapticFeedback?.impactOccurred(type),
    close: () => tg?.close(),
  }
}
