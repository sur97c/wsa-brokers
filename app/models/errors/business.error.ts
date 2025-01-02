// app/models/errors/business.error.ts

import { BaseError, ErrorSeverity } from './base.error'

export enum BusinessErrorCode {
  INVALID_OPERATION = 'BUS_001',
  RESOURCE_NOT_FOUND = 'BUS_002',
  VALIDATION_ERROR = 'BUS_003',
  USER_NOT_FOUND = 'BUS_004',
  USER_ALREADY_EXISTS = 'BUS_005',
  EMAIL_NOT_VERIFIED = 'BUS_006',
  SEND_EMAIL_VERIFICATION_ERROR = 'BUS_007',
  USER_DISABLED = 'BUS_008',
  USER_BLOCKED = 'BUS_009',
  USER_DELETED = 'BUS_010',
  ACTIVE_SESSION_EXISTS = 'BUS_011',
  INVALID_SESSION = 'BUS_012',
  SESSION_VALIDATION_ERROR = 'BUS_013',
  // ... más códigos específicos
}

export class BusinessError extends BaseError {
  constructor(
    message: string,
    code: BusinessErrorCode,
    context?: Record<string, unknown>
  ) {
    super(message, code, {
      severity: ErrorSeverity.WARNING,
      timestamp: new Date(), // Agregamos el timestamp requerido
      context: context ?? {}, // Aseguramos que context no sea undefined
    })
  }
}
