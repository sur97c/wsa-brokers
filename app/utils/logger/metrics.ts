// app/utils/logger/metrics.tsx

import { LogLevel } from './types'

export interface LogMetrics {
  logsPerMinute: number
  errorRate: number
  totalLogs: number
  logsByLevel: Record<LogLevel, number>
  averageLogSize: number
  flushSuccessRate: number
}

export class LoggerMetrics {
  private static instance: LoggerMetrics
  private metricsData: {
    timestamps: number[]
    errors: number
    totalLogs: number
    logsByLevel: Record<LogLevel, number>
    totalSize: number
    flushAttempts: number
    flushSuccess: number
  }

  private constructor() {
    this.metricsData = {
      timestamps: [],
      errors: 0,
      totalLogs: 0,
      logsByLevel: {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0,
      },
      totalSize: 0,
      flushAttempts: 0,
      flushSuccess: 0,
    }
  }

  public static getInstance(): LoggerMetrics {
    if (!LoggerMetrics.instance) {
      LoggerMetrics.instance = new LoggerMetrics()
    }
    return LoggerMetrics.instance
  }

  public trackLog(level: LogLevel, size: number): void {
    const now = Date.now()
    this.metricsData.timestamps = [
      ...this.metricsData.timestamps.filter((t) => now - t < 60000),
      now,
    ]

    this.metricsData.totalLogs++
    this.metricsData.logsByLevel[level]++
    this.metricsData.totalSize += size

    if (level === LogLevel.ERROR) {
      this.metricsData.errors++
    }
  }

  public trackFlush(success: boolean): void {
    this.metricsData.flushAttempts++
    if (success) {
      this.metricsData.flushSuccess++
    }
  }

  public getMetrics(): LogMetrics {
    return {
      logsPerMinute: this.metricsData.timestamps.length,
      errorRate: this.metricsData.errors / this.metricsData.totalLogs || 0,
      totalLogs: this.metricsData.totalLogs,
      logsByLevel: { ...this.metricsData.logsByLevel },
      averageLogSize:
        this.metricsData.totalSize / this.metricsData.totalLogs || 0,
      flushSuccessRate:
        this.metricsData.flushSuccess / this.metricsData.flushAttempts || 0,
    }
  }
}
