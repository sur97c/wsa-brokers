// app/translations/en/core/errors.ts

import { ErrorTranslations } from '@/translations/types/core/errors'

export const errorsEN: ErrorTranslations = {
  notFound: {
    title: '404 - Page Not Found',
    message:
      'Sorry, the page you are looking for does not exist or has been moved.',
  },
  genericError: {
    title: 'Error',
    message: 'Something went wrong. Please try again.',
  },
  systemError: {
    title: 'System Error',
    message: 'A critical error occurred. Please try again later.',
  },
  back: 'Go Back',
  home: 'Go Home',
  firebase: {
    auth: {
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/invalid-email': 'Email inválido',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Email ya registrado',
      'auth/email-not-verified': 'Email no verificado',
      'auth/session-expired': 'Sesión expirada',
      unknown: 'Error de autenticación desconocido',
    },
    business: {
      USER_BLOCKED: 'Usuario bloqueado',
      USER_DELETED: 'Usuario eliminado',
      USER_DISABLED: 'Usuario deshabilitado',
      EMAIL_NOT_VERIFIED: 'Email no verificado',
      USER_NOT_FOUND: 'Usuario no encontrado',
      USER_NOT_FOUND_IN_DB: 'Usuario no encontrado en la base de datos',
      unknown: 'Error de negocio desconocido',
    },
  },
}
