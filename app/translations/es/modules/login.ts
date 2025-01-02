// app/translations/es/modules/login.ts

import { LoginFormTranslations } from '@/translations/types/modules/login'

export const loginFormES: LoginFormTranslations = {
  email: 'Correo electrónico',
  password: 'Contraseña',
  rememberMe: 'Mantener la sesión',
  recoveryAccess: 'Recuperar acceso',
  recoveryAccessInfo:
    'Capture su email registrado, para restablecer el acceso.',
  emailToRecoveryAccess: 'Correo electrónico',
  signingIn: 'Iniciando sesión...',
  signIn: 'Iniciar sesión',
  sendingEmail: 'Enviando email...',
  sendEmail: 'Enviar email',
  emailNotVerified: {
    message: 'Email no verificado',
    resendLink: 'Reenviar email de verificación a {{email}}',
    resendLinkInfo: 'Se envió un email de verificación a {{email}}',
    resendLinkError: 'Error al reenviar email de verificación a {{email}}',
  },
}
