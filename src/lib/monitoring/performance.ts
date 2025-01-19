interface PerformanceMetric {
  type: 'conversation' | 'recipe' | 'guidance'
  action: string
  duration: number
  timestamp: string
  success: boolean
  error?: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private readonly maxMetrics = 100
  private startTimes: Map<string, number> = new Map()

  startTimer(type: PerformanceMetric['type'], action: string): string {
    const id = `${type}-${action}-${Date.now()}`
    this.startTimes.set(id, performance.now())
    return id
  }

  endTimer(id: string, success: boolean, error?: string) {
    const startTime = this.startTimes.get(id)
    if (!startTime) return

    const [type, action] = id.split('-')
    const duration = performance.now() - startTime
    this.startTimes.delete(id)

    this.addMetric({
      type: type as PerformanceMetric['type'],
      action,
      duration,
      timestamp: new Date().toISOString(),
      success,
      error,
    })
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Log slow operations
    if (metric.duration > 3000) {
      console.warn(`Slow operation detected: ${metric.type} - ${metric.action}`)
    }
  }

  getAverageResponseTime(type: PerformanceMetric['type']): number {
    const relevantMetrics = this.metrics.filter(m => m.type === type && m.success)
    if (relevantMetrics.length === 0) return 0

    const total = relevantMetrics.reduce((sum, m) => sum + m.duration, 0)
    return total / relevantMetrics.length
  }

  getSuccessRate(type: PerformanceMetric['type']): number {
    const relevantMetrics = this.metrics.filter(m => m.type === type)
    if (relevantMetrics.length === 0) return 0

    const successful = relevantMetrics.filter(m => m.success).length
    return (successful / relevantMetrics.length) * 100
  }

  getRecentMetrics(limit = 10): PerformanceMetric[] {
    return this.metrics.slice(-limit)
  }

  clearMetrics() {
    this.metrics = []
    this.startTimes.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()
