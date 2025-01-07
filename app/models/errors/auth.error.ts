// app/models/errors/auth.error.ts

import { BaseError, ErrorSeverity } from './base.error'

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'AUTH_001',
  SESSION_EXPIRED = 'AUTH_002',
  UNAUTHORIZED = 'AUTH_003',
  EMAIL_NOT_VERIFIED = 'AUTH_004',
  USER_DISABLED = 'AUTH_005',
  USER_NOT_FOUND = 'AUTH_006',
  UNKNOWN_AUTH_ERROR = 'AUTH_007',
  // ... más códigos específicos
}

export class AuthError extends BaseError {
  constructor(
    message: string,
    code: AuthErrorCode,
    context?: Record<string, unknown>
  ) {
    super(message, code, {
      severity: ErrorSeverity.ERROR,
      timestamp: new Date(), // Agregamos el timestamp requerido
      context: context ?? {}, // Aseguramos que context no sea undefined
    })
  }
}
