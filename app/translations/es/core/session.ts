// app/translations/es/core/session.ts

import type { SessionTranslations } from '@/translations/types/core/session'

export const sessionES: SessionTranslations = {
  timeoutWarning: 'Sesión por expirar',
  timeoutMessage:
    'Tu sesión expirará en {{minutes}} minutos y {{seconds}} segundos. ¿Deseas extender tu sesión?',
  accountDisabled: 'Cuenta deshabilitada',
  accountDisabledMessage:
    'Tu cuenta ha sido deshabilitada. Por favor, contacta al administrador del sistema.',
  extend: 'Extender sesión',
  logout: 'Cerrar sesión',
}
