// app/models/errors/base.error.ts

export interface ErrorMetadata {
  timestamp: Date
  severity: ErrorSeverity
  context?: Record<string, unknown>
}

export enum ErrorSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata: ErrorMetadata = {
      timestamp: new Date(),
      severity: ErrorSeverity.ERROR,
    }
  ) {
    super(message)
    this.name = this.constructor.name
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      metadata: this.metadata,
    }
  }
}
