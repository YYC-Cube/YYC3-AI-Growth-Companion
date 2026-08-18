/**
 * @fileoverview YYC³ WebSocket连接组件
 * @description 管理实时数据WebSocket连接和状态
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, AlertCircle, RefreshCw, Settings, CheckCircle, Clock, Activity, BarChart3, Zap, Server } from 'lucide-react'
interface WebSocketMessage {
  type: string
  id?: string
  timestamp?: number
  [key: string]: unknown
}

interface WebSocketConnectionProps {
  onDataReceived?: (data: WebSocketMessage) => void
  onConnectionChange?: (status: 'connected' | 'disconnected' | 'connecting' | 'error') => void
  endpoint?: string
  reconnectAttempts?: number
  reconnectInterval?: number
}

interface ConnectionStats {
  connectedAt: string | null
  lastMessageAt: string | null
  messagesReceived: number
  bytesReceived: number
  reconnectCount: number
  avgLatency: number
  uptime: number
}

export function WebSocketConnection({ 
  onDataReceived, 
  onConnectionChange,
  endpoint = 'wss://api.yyc3-ai.com/ws/analytics',
  reconnectAttempts = 5,
  reconnectInterval = 3000
}: WebSocketConnectionProps) {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected')
  const [showSettings, setShowSettings] = useState(false)
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    connectedAt: null,
    lastMessageAt: null,
    messagesReceived: 0,
    bytesReceived: 0,
    reconnectCount: 0,
    avgLatency: 0,
    uptime: 0
  })
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const latencyMeasurementsRef = useRef<number[]>([])
  const reconnectCountRef = useRef(0)

  // 计算连接运行时间
  useEffect(() => {
    if (connectionStatus === 'connected' && connectionStats.connectedAt) {
      const interval = setInterval(() => {
        setConnectionStats(prev => ({
          ...prev,
          uptime: Math.floor((Date.now() - new Date(prev.connectedAt!).getTime()) / 1000)
        }))
      }, 1000)
      
      return () => clearInterval(interval)
    }
    return undefined
  }, [connectionStatus, connectionStats.connectedAt])

  // 测量延迟
  const measureLatency = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const startTime = Date.now()
      const messageId = `ping_${startTime}`
      
      wsRef.current.send(JSON.stringify({
        type: 'ping',
        id: messageId,
        timestamp: startTime
      }))
      
      // 设置超时
      setTimeout(() => {
        const latency = Date.now() - startTime
        latencyMeasurementsRef.current.push(latency)
        
        // 保持最近10次测量
        if (latencyMeasurementsRef.current.length > 10) {
          latencyMeasurementsRef.current.shift()
        }
        
        // 计算平均延迟
        const avgLatency = latencyMeasurementsRef.current.reduce((a, b) => a + b, 0) / latencyMeasurementsRef.current.length
        
        setConnectionStats(prev => ({
          ...prev,
          avgLatency: Math.round(avgLatency)
        }))
      }, 100)
    }
  }, [])

  // 心跳检测
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      measureLatency()
    }, 30000) // 每30秒测量一次延迟
  }, [measureLatency])

  // 停止心跳
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  // 连接WebSocket
  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus('connecting')
    onConnectionChange?.('connecting')

    try {
      const ws = new WebSocket(endpoint)
      wsRef.current = ws

      ws.onopen = () => {
        setConnectionStatus('connected')
        onConnectionChange?.('connected')
        reconnectCountRef.current = 0
        
        setConnectionStats(prev => ({
          ...prev,
          connectedAt: new Date().toISOString(),
          reconnectCount: reconnectCountRef.current
        }))
        
        startHeartbeat()
        
        console.log('WebSocket连接已建立')
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // 处理pong响应
          if (data.type === 'pong' && data.id && data.id.startsWith('ping_')) {
            const startTime = parseInt(data.id.split('_')[1])
            const latency = Date.now() - startTime
            
            latencyMeasurementsRef.current.push(latency)
            if (latencyMeasurementsRef.current.length > 10) {
              latencyMeasurementsRef.current.shift()
            }
            
            const avgLatency = latencyMeasurementsRef.current.reduce((a, b) => a + b, 0) / latencyMeasurementsRef.current.length
            
            setConnectionStats(prev => ({
              ...prev,
              avgLatency: Math.round(avgLatency)
            }))
            
            return
          }
          
          // 更新统计信息
          setConnectionStats(prev => ({
            ...prev,
            lastMessageAt: new Date().toISOString(),
            messagesReceived: prev.messagesReceived + 1,
            bytesReceived: prev.bytesReceived + event.data.length
          }))
          
          // 触发数据回调
          onDataReceived?.(data)
          
        } catch (error) {
          console.error('WebSocket消息解析错误:', error)
        }
      }

      ws.onclose = (event) => {
        setConnectionStatus('disconnected')
        onConnectionChange?.('disconnected')
        stopHeartbeat()
        
        console.log('WebSocket连接已关闭:', event.code, event.reason)
        
        // 自动重连
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          setConnectionStats(prev => ({
            ...prev,
            reconnectCount: reconnectCountRef.current
          }))
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`尝试重连 (${reconnectCountRef.current}/${reconnectAttempts})`)
            connect()
          }, reconnectInterval)
        } else {
          setConnectionStatus('error')
          onConnectionChange?.('error')
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket连接错误:', error)
        setConnectionStatus('error')
        onConnectionChange?.('error')
      }

    } catch (error) {
      console.error('WebSocket连接失败:', error)
      setConnectionStatus('error')
      onConnectionChange?.('error')
    }
  }, [endpoint, onDataReceived, onConnectionChange, reconnectAttempts, reconnectInterval, startHeartbeat, stopHeartbeat])

  // 断开连接
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    stopHeartbeat()
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setConnectionStatus('disconnected')
    onConnectionChange?.('disconnected')
    reconnectCountRef.current = 0
  }, [onConnectionChange, stopHeartbeat])

  // 手动重连
  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(() => {
      reconnectCountRef.current = 0
      connect()
    }, 1000)
  }, [disconnect, connect])

  // 组件挂载时自动连接
  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, []) // 只在组件挂载/卸载时执行

  // 格式化运行时间
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟${secs}秒`
    } else {
      return `${secs}秒`
    }
  }

  // 格式化数据大小
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return Wifi
      case 'connecting':
        return RefreshCw
      case 'disconnected':
        return WifiOff
      case 'error':
        return AlertCircle
      default:
        return WifiOff
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'connecting':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'disconnected':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '已连接'
      case 'connecting':
        return '连接中'
      case 'disconnected':
        return '已断开'
      case 'error':
        return '连接错误'
      default:
        return '未知状态'
    }
  }

  const Icon = getStatusIcon()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题和控制区域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor()}`}>
            <Icon className={`w-6 h-6 ${
              connectionStatus === 'connecting' ? 'animate-spin' : ''
            }`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">实时数据连接</h2>
            <p className="text-sm text-gray-500">WebSocket连接状态管理</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 连接状态指示器 */}
          <div className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          
          {/* 控制按钮 */}
          <button
            onClick={reconnect}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            disabled={connectionStatus === 'connecting'}
          >
            <RefreshCw className={`w-4 h-4 ${
              connectionStatus === 'connecting' ? 'animate-spin' : ''
            }`} />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 连接统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">运行时间</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatUptime(connectionStats.uptime)}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">消息数量</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {connectionStats.messagesReceived.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">平均延迟</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {connectionStats.avgLatency}ms
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Server className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">数据流量</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatBytes(connectionStats.bytesReceived)}
          </p>
        </div>
      </div>

      {/* 连接详情 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">连接端点</span>
          <span className="text-sm font-mono text-gray-900">{endpoint}</span>
        </div>
        
        {connectionStats.connectedAt && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">连接时间</span>
            <span className="text-sm text-gray-900">
              {new Date(connectionStats.connectedAt).toLocaleString()}
            </span>
          </div>
        )}
        
        {connectionStats.lastMessageAt && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">最后消息</span>
            <span className="text-sm text-gray-900">
              {new Date(connectionStats.lastMessageAt).toLocaleString()}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">重连次数</span>
          <span className="text-sm text-gray-900">{connectionStats.reconnectCount}</span>
        </div>
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-900 mb-3">连接设置</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WebSocket端点
              </label>
              <input
                type="text"
                value={endpoint}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  重连尝试次数
                </label>
                <input
                  type="number"
                  value={reconnectAttempts}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  重连间隔(ms)
                </label>
                <input
                  type="number"
                  value={reconnectInterval}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={reconnect}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新连接
              </button>
              
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                断开连接
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 底部状态 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {connectionStatus === 'connected' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>连接稳定</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-gray-400" />
                <span>等待连接</span>
              </>
            )}
          </div>
          <span>协议: WebSocket</span>
        </div>
      </div>
    </div>
  )
}