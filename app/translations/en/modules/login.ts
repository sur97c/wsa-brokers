// app/translations/en/modules/login.ts

import { LoginFormTranslations } from '@/translations/types/modules/login'

export const loginFormEN: LoginFormTranslations = {
  email: 'Email',
  password: 'Password',
  rememberMe: 'Keep me signed in',
  recoveryAccess: 'Recover access',
  recoveryAccessInfo: 'Type the registered email, to reset access.',
  emailToRecoveryAccess: 'Email',
  signingIn: 'Signing session...',
  signIn: 'Sign in',
  sendingEmail: 'Sending email...',
  sendEmail: 'Send email',
  emailNotVerified: {
    message: 'Email not verified',
    resendLink: 'Resend verification email to {{email}}',
    resendLinkInfo: 'Verification email sent to {{email}}',
    resendLinkError:
      'Throwing error while resending verification email to {{email}}',
  },
}
