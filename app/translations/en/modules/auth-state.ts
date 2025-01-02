// app/translations/en/modules/auth-state.ts

import { AuthStateListenerTranslations } from '@/translations/types/modules/auth-state'

export const authStateListenerEN: AuthStateListenerTranslations = {
  title: 'Inactivity detected',
  message: 'Session is about to expire in {{timeLeft}} seconds.',
  extendSession: 'Extend session',
  closeSession: 'Close session',
}
