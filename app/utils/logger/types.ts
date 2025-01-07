// app/utils/logger/types.ts

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  userId?: string
  sessionId?: string
  tags?: string[]
}

export interface LoggerConfig {
  bufferSize: number
  flushInterval: number // en milisegundos
  rateLimitPerMinute: number
  maxRetries: number
  retryDelay: number // en milisegundos
  sensitiveKeys: string[]
  rotationConfig: {
    maxAge: number // en días
    maxSize: number // en bytes
  }
}
