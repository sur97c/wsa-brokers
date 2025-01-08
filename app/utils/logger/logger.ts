// app/utils/logger/logger.ts

// import { LogLevel, LogEntry, LoggerConfig } from './types'
// import { LogCompressor } from './compression'
// import { RateLimiter } from './rate-limiter'
// import { adminDb } from '@/firebase/firebase.admin'
// import { LoggerMetrics, type LogMetrics } from './metrics'
// import { LogFilterEngine, type LogFilter } from './filters'
// import { LogExporter, type ExportOptions } from './exporters'

const interpolateMessage = (
  message: string,
  values: Record<string, unknown>
): string => {
  return message.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = values[key]
    return value === undefined || value === null ? 'NO_VALUE' : String(value)
  })
}

export const logMessage = async (
  message: string,
  values: Record<string, unknown>
) => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  console.log(interpolateMessage(message, values))
}

// export class Logger {
//   private metrics: LoggerMetrics
//   private static activeFilters: LogFilter = {}

//   private static instance: Logger
//   private buffer: LogEntry[] = []
//   private rateLimiter: RateLimiter
//   private flushTimeout?: NodeJS.Timeout
//   private retryCount = 0
//   private totalSize = 0

//   private readonly config: LoggerConfig = {
//     bufferSize: 100,
//     flushInterval: 5000, // 5 segundos
//     rateLimitPerMinute: 1000,
//     maxRetries: 3,
//     retryDelay: 1000, // 1 segundo
//     sensitiveKeys: ['password', 'token', 'secret', 'authorization'],
//     rotationConfig: {
//       maxAge: 30, // 30 días
//       maxSize: 5 * 1024 * 1024, // 5MB
//     },
//   }

//   private constructor() {
//     this.rateLimiter = new RateLimiter(this.config.rateLimitPerMinute)
//     this.setupAutoFlush()
//     this.metrics = LoggerMetrics.getInstance()
//   }

//   public setFilters(filters: LogFilter): void {
//     Logger.activeFilters = filters
//   }

//   public getMetrics(): LogMetrics {
//     return this.metrics.getMetrics()
//   }

//   public async exportLogs(options: ExportOptions): Promise<Blob> {
//     const logs = await this.fetchLogs()
//     return LogExporter.export(logs, options)
//   }

//   private async fetchLogs(): Promise<LogEntry[]> {
//     // Implementar la lógica para obtener logs de Firestore
//     const snapshot = await adminDb
//       .collection('logs')
//       .orderBy('timestamp', 'desc')
//       .limit(1000)
//       .get()

//     return snapshot.docs.flatMap((doc) => {
//       const data = doc.data()
//       return data.entries as LogEntry[]
//     })
//   }

//   public static getInstance(): Logger {
//     if (!Logger.instance) {
//       Logger.instance = new Logger()
//     }
//     return Logger.instance
//   }

//   private setupAutoFlush(): void {
//     if (this.flushTimeout) {
//       clearInterval(this.flushTimeout)
//     }

//     this.flushTimeout = setInterval(
//       () => this.flushLogs(),
//       this.config.flushInterval
//     )
//   }

//   public log(entry: LogEntry): void {
//     if (!this.rateLimiter.canProcess()) {
//       this.metrics.trackLog(LogLevel.WARN, 0)
//       console.warn('Rate limit exceeded, log entry dropped')
//       return
//     }

//     // Aplicar filtros activos
//     if (!LogFilterEngine.filter([entry], Logger.activeFilters).length) {
//       return
//     }

//     const sanitizedEntry = this.sanitizeEntry(entry)
//     const entrySize = this.calculateSize(sanitizedEntry)

//     this.metrics.trackLog(entry.level, entrySize)

//     if (this.totalSize + entrySize > this.config.rotationConfig.maxSize) {
//       this.rotate()
//     }

//     this.buffer.push(sanitizedEntry)
//     this.totalSize += entrySize

//     if (process.env.NODE_ENV === 'development') {
//       this.consoleLog(sanitizedEntry)
//     }

//     if (this.buffer.length >= this.config.bufferSize) {
//       void this.flushLogs()
//     }
//   }

//   private sanitizeEntry(entry: LogEntry): LogEntry {
//     const sanitized = { ...entry }

//     if (sanitized.context) {
//       sanitized.context = this.sanitizeObject(sanitized.context)
//     }

//     return sanitized
//   }

//   private sanitizeObject(
//     obj: Record<string, unknown>
//   ): Record<string, unknown> {
//     const sanitized: Record<string, unknown> = {}

//     for (const [key, value] of Object.entries(obj)) {
//       if (this.config.sensitiveKeys.includes(key.toLowerCase())) {
//         sanitized[key] = '[REDACTED]'
//       } else if (typeof value === 'object' && value !== null) {
//         sanitized[key] = this.sanitizeObject(value as Record<string, unknown>)
//       } else {
//         sanitized[key] = value
//       }
//     }

//     return sanitized
//   }

//   private calculateSize(entry: LogEntry): number {
//     return Buffer.from(JSON.stringify(entry)).length
//   }

//   private async rotate(): Promise<void> {
//     const cutoffDate = new Date()
//     cutoffDate.setDate(cutoffDate.getDate() - this.config.rotationConfig.maxAge)

//     try {
//       const batch = adminDb.batch()

//       // Archivar logs antiguos
//       const oldLogs = await adminDb
//         .collection('logs')
//         .where('timestamp', '<', cutoffDate)
//         .get()

//       // Comprimir y mover a archivo
//       const compressedLogs = LogCompressor.compress(
//         oldLogs.docs.map((doc) => doc.data())
//       )

//       const archiveRef = adminDb.collection('logs_archive').doc()
//       batch.set(archiveRef, {
//         data: compressedLogs,
//         timestamp: new Date(),
//         count: oldLogs.size,
//       })

//       // Eliminar logs antiguos
//       oldLogs.docs.forEach((doc) => {
//         batch.delete(doc.ref)
//       })

//       await batch.commit()
//       this.totalSize = 0
//     } catch (error) {
//       console.error('Error rotating logs:', error)
//     }
//   }

//   private async flushLogs(): Promise<void> {
//     if (this.buffer.length === 0) return

//     try {
//       const logsToSend = [...this.buffer]
//       this.buffer = []
//       this.totalSize = 0

//       // Comprimir antes de enviar
//       const compressedLogs = LogCompressor.compress(logsToSend)

//       // Batch write a Firestore
//       const batch = adminDb.batch()
//       const chunks = this.chunkArray(logsToSend, 500) // Firestore limit

//       for (const chunk of chunks) {
//         const ref = adminDb.collection('logs').doc()
//         batch.set(ref, {
//           entries: chunk,
//           compressed: compressedLogs,
//           timestamp: new Date(),
//         })
//       }

//       await batch.commit()
//       this.metrics.trackFlush(true)
//       this.retryCount = 0
//     } catch (error) {
//       console.error('Error flushing logs:', error)
//       this.metrics.trackFlush(false)
//       if (this.retryCount < this.config.maxRetries) {
//         this.retryCount++
//         setTimeout(
//           () => this.flushLogs(),
//           this.config.retryDelay * this.retryCount
//         )
//       } else {
//         // Si fallaron todos los reintentos, guardar en localStorage como respaldo
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('failedLogs', JSON.stringify(this.buffer))
//         }
//       }
//     }
//   }

//   private chunkArray<T>(array: T[], size: number): T[][] {
//     const chunks: T[][] = []
//     for (let i = 0; i < array.length; i += size) {
//       chunks.push(array.slice(i, i + size))
//     }
//     return chunks
//   }

//   // ... resto del código de consoleLog que ya teníamos
// }
