/**
 * YYC³ AI小语智能成长守护系统 - 性能监控仪表板
 * 第五阶段系统优化与扩展
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { performanceAnalyzer, PerformanceMetrics } from '@/lib/performance/analyzer'

interface PerformanceScore {
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  color: string
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [score, setScore] = useState<PerformanceScore | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 延迟1秒后收集数据，确保页面加载完成
    const timer = setTimeout(() => {
      updateMetrics()
    }, 1000)

    // 每5秒更新一次数据
    const interval = setInterval(updateMetrics, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const updateMetrics = () => {
    const currentMetrics = performanceAnalyzer.getReport()
    const currentScore = performanceAnalyzer.getPerformanceScore()
    const currentSuggestions = performanceAnalyzer.getOptimizationSuggestions()

    setMetrics(currentMetrics)
    setScore(calculateScore(currentScore))
    setSuggestions(currentSuggestions)
  }

  const calculateScore = (scoreValue: number): PerformanceScore => {
    if (scoreValue >= 90) return { score: scoreValue, grade: 'A', color: 'text-green-600' }
    if (scoreValue >= 80) return { score: scoreValue, grade: 'B', color: 'text-blue-600' }
    if (scoreValue >= 70) return { score: scoreValue, grade: 'C', color: 'text-yellow-600' }
    if (scoreValue >= 60) return { score: scoreValue, grade: 'D', color: 'text-orange-600' }
    return { score: scoreValue, grade: 'F', color: 'text-red-600' }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
        title="性能监控"
      >
        <i className="ri-speed-line text-xl" />
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">性能监控</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 性能评分 */}
        {score && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">总体评分</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${score.color}`}>
                {score.grade}
              </span>
              <span className="text-sm text-gray-600">{score.score}分</span>
            </div>
          </div>
        )}

        {/* 核心指标 */}
        {metrics && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">核心指标</h4>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-blue-600 font-medium">FCP</div>
                <div className="text-gray-700">{formatTime(metrics.runtime.firstContentfulPaint)}</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="text-green-600 font-medium">LCP</div>
                <div className="text-gray-700">{formatTime(metrics.runtime.largestContentfulPaint)}</div>
              </div>
              <div className="p-2 bg-yellow-50 rounded">
                <div className="text-yellow-600 font-medium">CLS</div>
                <div className="text-gray-700">{metrics.runtime.cumulativeLayoutShift.toFixed(3)}</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="text-purple-600 font-medium">FID</div>
                <div className="text-gray-700">{formatTime(metrics.runtime.firstInputDelay)}</div>
              </div>
            </div>
          </div>
        )}

        {/* 内存使用 */}
        {metrics && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">内存使用</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">已使用:</span>
                <span className="font-medium">{formatBytes(metrics.memory.usedJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总计:</span>
                <span className="font-medium">{formatBytes(metrics.memory.totalJSHeapSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">限制:</span>
                <span className="font-medium">{formatBytes(metrics.memory.jsHeapSizeLimit)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 网络请求 */}
        {metrics && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">网络请求</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">请求总数:</span>
                <span className="font-medium">{metrics.network.totalRequests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">传输大小:</span>
                <span className="font-medium">{formatBytes(metrics.network.totalTransferred)}</span>
              </div>
              {metrics.network.slowRequests.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">慢请求:</span>
                  <span className="font-medium text-orange-600">{metrics.network.slowRequests.length}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 组件性能 */}
        {metrics && metrics.components.slowComponents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">慢组件</h4>
            <div className="space-y-1 text-sm">
              {metrics.components.slowComponents.map((component, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600 truncate">{component.name}</span>
                  <span className="font-medium text-orange-600">{formatTime(component.renderTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 优化建议 */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">优化建议</h4>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="text-sm text-gray-600 p-2 bg-yellow-50 rounded">
                  • {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 刷新按钮 */}
        <div className="flex justify-center">
          <button
            onClick={updateMetrics}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            <i className="ri-refresh-line mr-1" />
            刷新数据
          </button>
        </div>
      </div>
    </motion.div>
  )
}