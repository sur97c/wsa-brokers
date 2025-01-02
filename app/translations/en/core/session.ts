// app/translations/en/core/session.ts

import type { SessionTranslations } from '@/translations/types/core/session'

export const sessionEN: SessionTranslations = {
  timeoutWarning: 'Session about to expire',
  timeoutMessage:
    'Your session will expire in {{minutes}} minutes and {{seconds}} seconds. Would you like to extend your session?',
  accountDisabled: 'Account disabled',
  accountDisabledMessage:
    'Your account has been disabled. Please contact the system administrator.',
  extend: 'Extend session',
  logout: 'Logout',
}
