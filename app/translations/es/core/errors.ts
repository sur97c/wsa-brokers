// app/translations/es/core/errors.ts

import { ErrorTranslations } from '@/translations/types/core/errors'

export const errorsES: ErrorTranslations = {
  notFound: {
    title: '404 - Página no encontrada',
    message: 'Lo sentimos, la página que buscas no existe o ha sido movida.',
  },
  genericError: {
    title: '¡Algo salió mal!',
    message: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
  },
  systemError: {
    title: 'Error del sistema, ¡Algo salió mal!',
    message:
      'Un error critico ha ocurrido. Por favor, inténtalo de nuevo mas tarde.',
  },
  back: 'Volver',
  home: 'Ir a Inicio',
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
