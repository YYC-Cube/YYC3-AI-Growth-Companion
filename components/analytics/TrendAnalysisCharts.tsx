/**
 * @fileoverview YYC³ 趋势分析图表组件
 * @description 展示业务数据趋势和分析图表
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Download, Settings, PieChart as PieChartIcon, Calendar } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
// Remove the non-existent RealtimeMetrics import
// import { RealtimeMetrics, TrendChartData } from '@/types/analytics'

interface ChartDataPoint {
  timestamp: string
  time: string
  activeUsers: number
  aiConversations: number
  satisfaction: number
  systemHealth: number
  responseTime: number
  pageViews: number
}

interface PieDataPoint {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

interface TrendAnalysisChartsProps {
  timeRange: string
  metrics: any // Using any since RealtimeMetrics doesn't exist
}

export function TrendAnalysisCharts({ timeRange, metrics }: TrendAnalysisChartsProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [pieData, setPieData] = useState<PieDataPoint[]>([])
  const [selectedChart, setSelectedChart] = useState<'line' | 'area' | 'bar'>('line')
  const [isLoading, setIsLoading] = useState(true)

  // 生成模拟图表数据
  useEffect(() => {
    const generateTimeSeriesData = () => {
      const now = new Date()
      const dataPoints = []
      
      const intervals = {
        '1h': 12,      // 每5分钟一个点
        '24h': 24,     // 每小时一个点
        '7d': 7,       // 每天一个点
        '30d': 30      // 每天一个点
      }
      
      const intervalCount = intervals[timeRange as keyof typeof intervals] || 24
      const intervalMs = (24 * 60 * 60 * 1000) / intervalCount // 24小时内的间隔毫秒数
      
      for (let i = intervalCount - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * intervalMs))
        const baseUsers = 1000 + Math.random() * 500
        const baseConversations = 200 + Math.random() * 100
        const baseSatisfaction = 0.85 + Math.random() * 0.1
        
        dataPoints.push({
          timestamp: timestamp.toISOString(),
          time: timestamp.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            ...(timeRange.includes('d') && { month: '2-digit', day: '2-digit' })
          }),
          activeUsers: Math.floor(baseUsers + Math.sin(i * 0.5) * 200),
          aiConversations: Math.floor(baseConversations + Math.cos(i * 0.3) * 50),
          satisfaction: parseFloat((baseSatisfaction + Math.sin(i * 0.2) * 0.05).toFixed(3)),
          systemHealth: parseFloat((0.9 + Math.random() * 0.1).toFixed(3)),
          responseTime: Math.floor(150 + Math.random() * 100),
          pageViews: Math.floor(baseUsers * 2.5 + Math.random() * 500)
        })
      }
      
      return dataPoints
    }

    const generatePieData = () => {
      return [
        { name: '用户行为分析', value: 35, color: 'var(--color-blue)' },
        { name: 'AI交互', value: 25, color: 'var(--color-purple-light)' },
        { name: '成长记录', value: 20, color: 'var(--color-green)' },
        { name: '系统监控', value: 15, color: 'var(--color-yellow)' },
        { name: '其他', value: 5, color: 'var(--color-gray-600)' }
      ]
    }

    // 模拟数据加载
    setTimeout(() => {
      setChartData(generateTimeSeriesData())
      setPieData(generatePieData())
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'satisfaction' || entry.name === 'systemHealth' 
                ? `${(entry.value * 100).toFixed(1)}%`
                : entry.name === 'responseTime'
                ? `${entry.value}ms`
                : entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="activeUsers" 
          stroke="#3B82F6" 
          strokeWidth={2}
          dot={{ r: 3 }}
          name="活跃用户"
        />
        <Line 
          type="monotone" 
          dataKey="aiConversations" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          dot={{ r: 3 }}
          name="AI对话"
        />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="pageViews" 
          stroke="#10B981" 
          fill="#10B981" 
          fillOpacity={0.3}
          strokeWidth={2}
          name="页面浏览"
        />
        <Area 
          type="monotone" 
          dataKey="activeUsers" 
          stroke="#3B82F6" 
          fill="#3B82F6" 
          fillOpacity={0.3}
          strokeWidth={2}
          name="活跃用户"
        />
      </AreaChart>
    </ResponsiveContainer>
  )

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData.slice(-12)}> {/* 显示最近12个数据点 */}
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="responseTime" fill="#F59E0B" name="响应时间(ms)" />
        <Bar dataKey="activeUsers" fill="#3B82F6" name="活跃用户" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )

  const getTrendIndicator = (metric: string) => {
    // 模拟趋势计算
    const isPositive = Math.random() > 0.5
    const percentage = (Math.random() * 20).toFixed(1)
    
    return (
      <div className={`flex items-center space-x-1 text-sm ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{isPositive ? '+' : '-'}{percentage}%</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">加载图表数据中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 标题和控制区域 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">趋势分析图表</h2>
            <p className="text-sm text-gray-500">业务数据趋势可视化</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 图表类型选择 */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedChart('line')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedChart === 'line' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              折线图
            </button>
            <button
              onClick={() => setSelectedChart('area')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedChart === 'area' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              面积图
            </button>
            <button
              onClick={() => setSelectedChart('bar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedChart === 'bar' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              柱状图
            </button>
          </div>
          
          {/* 操作按钮 */}
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 趋势指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { name: '用户增长', value: '+12.5%', color: 'blue' },
          { name: '对话量', value: '+8.3%', color: 'purple' },
          { name: '满意度', value: '+2.1%', color: 'green' },
          { name: '响应时间', value: '-15.2%', color: 'orange' }
        ].map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`p-3 rounded-lg border ${
              item.color === 'blue' ? 'border-blue-200 bg-blue-50' :
              item.color === 'purple' ? 'border-purple-200 bg-purple-50' :
              item.color === 'green' ? 'border-green-200 bg-green-50' :
              'border-orange-200 bg-orange-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{item.name}</span>
              {getTrendIndicator(item.name)}
            </div>
            <div className={`text-lg font-bold ${
              item.color === 'blue' ? 'text-blue-600' :
              item.color === 'purple' ? 'text-purple-600' :
              item.color === 'green' ? 'text-green-600' :
              'text-orange-600'
            }`}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 主图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要趋势图 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {selectedChart === 'line' ? '用户活跃度趋势' :
               selectedChart === 'area' ? '流量分布趋势' : '性能指标对比'}
            </h3>
            {selectedChart === 'line' && renderLineChart()}
            {selectedChart === 'area' && renderAreaChart()}
            {selectedChart === 'bar' && renderBarChart()}
          </div>
        </div>

        {/* 饼图 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <PieChartIcon className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-700">功能使用分布</h3>
            </div>
            {renderPieChart()}
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>时间范围: {timeRange === '1h' ? '过去1小时' : 
                            timeRange === '24h' ? '过去24小时' : 
                            timeRange === '7d' ? '过去7天' : '过去30天'}</span>
            <span>•</span>
            <span>更新频率: {timeRange === '1h' ? '5分钟' : '1小时'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>数据时间: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}