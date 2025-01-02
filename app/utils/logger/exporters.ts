// app/utils/logger/exporters.ts

import { LogCompressor } from './compression'
import { LogFilterEngine, type LogFilter } from './filters'
import type { LogEntry } from './types'

export interface ExportOptions {
  format: 'json' | 'csv' | 'txt'
  compressed?: boolean
  filter?: LogFilter
}

export class LogExporter {
  static async export(logs: LogEntry[], options: ExportOptions): Promise<Blob> {
    // Aplicar filtros si existen
    let filteredLogs = logs
    if (options.filter) {
      filteredLogs = LogFilterEngine.filter(logs, options.filter)
    }

    // Exportar según formato
    let content: string
    switch (options.format) {
      case 'json':
        content = JSON.stringify(filteredLogs, null, 2)
        break

      case 'csv':
        content = this.toCSV(filteredLogs)
        break

      case 'txt':
        content = this.toText(filteredLogs)
        break

      default:
        throw new Error(`Unsupported format: ${options.format}`)
    }

    // Comprimir si es necesario
    if (options.compressed) {
      const compressed = LogCompressor.compress(content)
      return new Blob([compressed], { type: 'application/octet-stream' })
    }

    return new Blob([content], { type: this.getContentType(options.format) })
  }

  private static toCSV(logs: LogEntry[]): string {
    const headers = [
      'timestamp',
      'level',
      'message',
      'userId',
      'sessionId',
      'tags',
    ]
    const rows = logs.map((log) => [
      log.timestamp.toISOString(),
      log.level,
      log.message,
      log.userId || '',
      log.sessionId || '',
      (log.tags || []).join(';'),
    ])

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  }

  private static toText(logs: LogEntry[]): string {
    return logs
      .map((log) => {
        const timestamp = log.timestamp.toISOString()
        const tags = log.tags ? `[${log.tags.join(', ')}]` : ''
        return `[${timestamp}] ${log.level} ${tags} ${log.message}`
      })
      .join('\n')
  }

  private static getContentType(format: string): string {
    switch (format) {
      case 'json':
        return 'application/json'
      case 'csv':
        return 'text/csv'
      case 'txt':
        return 'text/plain'
      default:
        return 'application/octet-stream'
    }
  }
}
