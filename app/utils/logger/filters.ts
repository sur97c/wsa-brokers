// app/utils/logger/filters.ts

import { LogEntry, LogLevel } from './types'

export interface LogFilter {
  levels?: LogLevel[]
  tags?: string[]
  fromDate?: Date
  toDate?: Date
  userId?: string
  searchText?: string
}

export class LogFilterEngine {
  static filter(logs: LogEntry[], filter: LogFilter): LogEntry[] {
    return logs.filter((log) => {
      // Filtrar por nivel
      if (filter.levels && !filter.levels.includes(log.level)) {
        return false
      }

      // Filtrar por tags
      if (filter.tags && log.tags) {
        if (!filter.tags.some((tag) => log.tags?.includes(tag))) {
          return false
        }
      }

      // Filtrar por fecha
      if (filter.fromDate && log.timestamp < filter.fromDate) {
        return false
      }
      if (filter.toDate && log.timestamp > filter.toDate) {
        return false
      }

      // Filtrar por usuario
      if (filter.userId && log.userId !== filter.userId) {
        return false
      }

      // Búsqueda en texto
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase()
        const logText = JSON.stringify(log).toLowerCase()
        if (!logText.includes(searchLower)) {
          return false
        }
      }

      return true
    })
  }
}
