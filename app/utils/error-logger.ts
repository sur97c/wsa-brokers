// app/utils/error-logger.ts

import {
  BaseError,
  ErrorSeverity,
  type ErrorMetadata,
} from '@/models/errors/base.error'
import { FirebaseError } from 'firebase/app'

export class ErrorLogger {
  private static instance: ErrorLogger

  private constructor() {}

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  public logError(error: unknown, context?: Record<string, unknown>): void {
    const normalizedError = this.normalizeError(error)
    console.error('Error logged:', {
      ...normalizedError,
      context,
      timestamp: new Date().toISOString(),
    })
  }

  public normalizeError(error: unknown): BaseError {
    const metadata: ErrorMetadata = {
      timestamp: new Date(),
      severity: ErrorSeverity.ERROR,
      context: {},
    }

    if (error instanceof BaseError) {
      return error
    }

    if (error instanceof FirebaseError) {
      return new BaseError(error.message, error.code, {
        ...metadata,
        context: { originalError: error },
      })
    }

    return new BaseError(
      error instanceof Error ? error.message : 'Unknown error',
      'UNKNOWN_ERROR',
      {
        ...metadata,
        context: { originalError: error },
      }
    )
  }
}
