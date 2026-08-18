/**
 * YYC³ AI小语智能成长守护系统 - 性能分析工具
 * 用于第五阶段系统优化与扩展
 */

export interface PerformanceMetrics {
  // Bundle分析
  bundleSize: {
    total: number
    chunks: number
    largestChunk: number
    gzipped: number
  }

  // 运行时性能
  runtime: {
    firstContentfulPaint: number
    largestContentfulPaint: number
    cumulativeLayoutShift: number
    firstInputDelay: number
    timeToInteractive: number
  }

  // 内存使用
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }

  // 网络性能
  network: {
    totalRequests: number
    totalTransferred: number
    slowRequests: number[]
  }

  // 组件性能
  components: {
    renderTime: number
    reRenders: number
    slowComponents: Array<{
      name: string
      renderTime: number
      reRenders: number
    }>
  }
}

export class PerformanceAnalyzer {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  /**
   * 初始化性能观察器
   */
  private initializeObservers() {
    if (typeof window === 'undefined') return

    // 观察导航性能
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.metrics.runtime = {
              firstContentfulPaint: navEntry.responseStart - navEntry.requestStart,
              largestContentfulPaint: navEntry.loadEventEnd - navEntry.navigationStart,
              cumulativeLayoutShift: 0, // 需要CLS观察器
              firstInputDelay: 0, // 需要FID观察器
              timeToInteractive: navEntry.domInteractive - navEntry.navigationStart
            }
          }
        }
      })

      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navigationObserver)
    } catch (error) {
      console.warn('Navigation observer not supported:', error)
    }

    // 观察资源加载
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const resources = list.getEntries()
        let totalTransferred = 0
        const slowRequests: any[] = []

        resources.forEach(resource => {
          const resourceEntry = resource as PerformanceResourceTiming
          totalTransferred += resourceEntry.transferSize || 0

          // 识别慢请求（超过1秒）
          if (resourceEntry.duration > 1000) {
            slowRequests.push({
              name: resourceEntry.name,
              duration: resourceEntry.duration,
              size: resourceEntry.transferSize
            })
          }
        })

        this.metrics.network = {
          totalRequests: resources.length,
          totalTransferred,
          slowRequests
        }
      })

      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (error) {
      console.warn('Resource observer not supported:', error)
    }

    // 观察CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }

        if (this.metrics.runtime) {
          this.metrics.runtime.cumulativeLayoutShift = clsValue
        }
      })

      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    } catch (error) {
      console.warn('CLS observer not supported:', error)
    }

    // 观察FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.runtime = {
            ...this.metrics.runtime!,
            firstInputDelay: (entry as any).processingStart - entry.startTime
          }
          break // 只需要第一次输入
        }
      })

      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)
    } catch (error) {
      console.warn('FID observer not supported:', error)
    }
  }

  /**
   * 收集内存信息
   */
  collectMemoryInfo() {
    if (typeof window === 'undefined' || !(performance as any).memory) return

    const memory = (performance as any).memory
    this.metrics.memory = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    }
  }

  /**
   * 分析组件性能
   */
  analyzeComponentPerformance(componentName: string, renderTime: number) {
    if (!this.metrics.components) {
      this.metrics.components = {
        renderTime: 0,
        reRenders: 0,
        slowComponents: []
      }
    }

    this.metrics.components.renderTime += renderTime
    this.metrics.components.reRenders++

    // 记录慢组件（超过16ms）
    if (renderTime > 16) {
      const existingComponent = this.metrics.components.slowComponents.find(
        c => c.name === componentName
      )

      if (existingComponent) {
        existingComponent.renderTime += renderTime
        existingComponent.reRenders++
      } else {
        this.metrics.components.slowComponents.push({
          name: componentName,
          renderTime,
          reRenders: 1
        })
      }
    }
  }

  /**
   * 获取性能报告
   */
  getReport(): PerformanceMetrics {
    this.collectMemoryInfo()

    return {
      bundleSize: this.metrics.bundleSize || {
        total: 0,
        chunks: 0,
        largestChunk: 0,
        gzipped: 0
      },
      runtime: this.metrics.runtime || {
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        timeToInteractive: 0
      },
      memory: this.metrics.memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      },
      network: this.metrics.network || {
        totalRequests: 0,
        totalTransferred: 0,
        slowRequests: []
      },
      components: this.metrics.components || {
        renderTime: 0,
        reRenders: 0,
        slowComponents: []
      }
    }
  }

  /**
   * 获取性能评分
   */
  getPerformanceScore(): number {
    const metrics = this.getReport()
    let score = 100

    // FCP评分 (0-2.5s)
    if (metrics.runtime.firstContentfulPaint > 2500) {
      score -= 20
    } else if (metrics.runtime.firstContentfulPaint > 1800) {
      score -= 10
    }

    // LCP评分 (0-4s)
    if (metrics.runtime.largestContentfulPaint > 4000) {
      score -= 25
    } else if (metrics.runtime.largestContentfulPaint > 2500) {
      score -= 15
    }

    // CLS评分 (<0.1)
    if (metrics.runtime.cumulativeLayoutShift > 0.25) {
      score -= 20
    } else if (metrics.runtime.cumulativeLayoutShift > 0.1) {
      score -= 10
    }

    // FID评分 (<100ms)
    if (metrics.runtime.firstInputDelay > 300) {
      score -= 15
    } else if (metrics.runtime.firstInputDelay > 100) {
      score -= 8
    }

    // 内存使用评分 (<50MB)
    const memoryMB = metrics.memory.usedJSHeapSize / (1024 * 1024)
    if (memoryMB > 100) {
      score -= 15
    } else if (memoryMB > 50) {
      score -= 8
    }

    return Math.max(0, score)
  }

  /**
   * 获取优化建议
   */
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = []
    const metrics = this.getReport()

    // FCP建议
    if (metrics.runtime.firstContentfulPaint > 1800) {
      suggestions.push('优化首屏内容绘制：减少关键资源，启用代码分割')
    }

    // LCP建议
    if (metrics.runtime.largestContentfulPaint > 2500) {
      suggestions.push('优化最大内容绘制：压缩图片，优化关键渲染路径')
    }

    // CLS建议
    if (metrics.runtime.cumulativeLayoutShift > 0.1) {
      suggestions.push('减少累积布局偏移：为图片和广告设置尺寸，避免插入内容')
    }

    // FID建议
    if (metrics.runtime.firstInputDelay > 100) {
      suggestions.push('减少首次输入延迟：减少JavaScript执行时间，优化交互响应')
    }

    // 内存建议
    const memoryMB = metrics.memory.usedJSHeapSize / (1024 * 1024)
    if (memoryMB > 50) {
      suggestions.push('优化内存使用：清理未使用的组件，优化数据结构')
    }

    // 网络建议
    if (metrics.network.totalRequests > 100) {
      suggestions.push('减少网络请求：合并资源，启用HTTP缓存')
    }

    if (metrics.network.slowRequests.length > 0) {
      suggestions.push(`优化慢请求：发现${metrics.network.slowRequests.length}个慢速请求`)
    }

    // 组件建议
    if (metrics.components.slowComponents.length > 0) {
      suggestions.push('优化组件性能：使用React.memo，useMemo，useCallback')
    }

    return suggestions
  }

  /**
   * 清理观察器
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 导出单例实例
export const performanceAnalyzer = new PerformanceAnalyzer()

// React Hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startTimeRef = React.useRef<number>()

  React.useEffect(() => {
    startTimeRef.current = performance.now()

    return () => {
      if (startTimeRef.current) {
        const renderTime = performance.now() - startTimeRef.current
        performanceAnalyzer.analyzeComponentPerformance(componentName, renderTime)
      }
    }
  })
}