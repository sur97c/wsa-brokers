// app/utils/logger/rate-limiter.ts

export class RateLimiter {
  private timestamps: number[] = []
  private readonly limit: number
  private readonly interval: number

  constructor(limitPerMinute: number) {
    this.limit = limitPerMinute
    this.interval = 60 * 1000 // 1 minuto en milisegundos
  }

  canProcess(): boolean {
    const now = Date.now()
    this.timestamps = this.timestamps.filter(
      (time) => now - time < this.interval
    )

    if (this.timestamps.length < this.limit) {
      this.timestamps.push(now)
      return true
    }

    return false
  }
}
