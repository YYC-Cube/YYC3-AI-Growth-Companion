'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMonitorProps {
  autoStart?: boolean;
  showMetrics?: boolean;
  showAlerts?: boolean;
  className?: string;
}

export const PerformanceMonitorPanel: React.FC<PerformanceMonitorProps> = ({
  autoStart = false,
  showMetrics = true,
  showAlerts = true,
  className = '',
}) => {
  const {
    isMonitoring,
    metrics,
    alerts,
    report,
    startMonitoring,
    stopMonitoring,
    updateMetrics,
    generateReport,
    sendReport,
    clearMetrics,
  } = usePerformanceMonitor();

  useEffect(() => {
    if (autoStart) {
      startMonitoring();
    }
  }, [autoStart, startMonitoring]);

  const getMetricGrade = (value: number, metric: keyof typeof thresholds): 'good' | 'warning' | 'poor' => {
    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'warning';
    return 'poor';
  };

  const getMetricColor = (grade: 'good' | 'warning' | 'poor'): string => {
    switch (grade) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
    }
  };

  const getMetricProgress = (value: number, metric: keyof typeof thresholds): number => {
    const threshold = thresholds[metric];
    if (value <= threshold.good) return 100;
    if (value <= threshold.needsImprovement) {
      return Math.round(100 - ((value - threshold.good) / (threshold.needsImprovement - threshold.good)) * 30);
    }
    if (value <= threshold.poor) {
      return Math.round(70 - ((value - threshold.needsImprovement) / (threshold.poor - threshold.needsImprovement)) * 50);
    }
    return 0;
  };

  const thresholds = {
    fcp: { good: 1800, needsImprovement: 3000, poor: 4000 },
    lcp: { good: 2500, needsImprovement: 4000, poor: 6000 },
    cls: { good: 0.1, needsImprovement: 0.25, poor: 0.5 },
    fid: { good: 100, needsImprovement: 300, poor: 500 },
    ttfb: { good: 800, needsImprovement: 1800, poor: 3000 },
  };

  const getAlertIcon = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A':
        return 'bg-green-500';
      case 'B':
        return 'bg-blue-500';
      case 'C':
        return 'bg-yellow-500';
      case 'D':
        return 'bg-orange-500';
      case 'F':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatValue = (value: number, metric: string): string => {
    if (metric === 'cls') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            性能监控
          </CardTitle>
          <div className="flex items-center gap-2">
            {report && (
              <Badge className={cn('text-white', getGradeColor(report.grade))}>
                {report.grade} - {report.score}分
              </Badge>
            )}
            <Button
              variant={isMonitoring ? 'destructive' : 'default'}
              size="sm"
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
            >
              {isMonitoring ? '停止' : '开始'}
            </Button>
            <Button variant="outline" size="sm" onClick={updateMetrics}>
              刷新
            </Button>
            <Button variant="outline" size="sm" onClick={generateReport}>
              生成报告
            </Button>
            <Button variant="outline" size="sm" onClick={clearMetrics}>
              清除
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {showMetrics && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">核心指标</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.fcp !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">FCP</span>
                    <span className={cn('text-sm font-semibold', getMetricColor(getMetricGrade(metrics.fcp, 'fcp')))}>
                      {formatValue(metrics.fcp, 'fcp')}
                    </span>
                  </div>
                  <Progress value={getMetricProgress(metrics.fcp, 'fcp')} className="h-2" />
                  <p className="text-xs text-gray-500">首次内容绘制</p>
                </div>
              )}

              {metrics.lcp !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">LCP</span>
                    <span className={cn('text-sm font-semibold', getMetricColor(getMetricGrade(metrics.lcp, 'lcp')))}>
                      {formatValue(metrics.lcp, 'lcp')}
                    </span>
                  </div>
                  <Progress value={getMetricProgress(metrics.lcp, 'lcp')} className="h-2" />
                  <p className="text-xs text-gray-500">最大内容绘制</p>
                </div>
              )}

              {metrics.cls !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CLS</span>
                    <span className={cn('text-sm font-semibold', getMetricColor(getMetricGrade(metrics.cls, 'cls')))}>
                      {formatValue(metrics.cls, 'cls')}
                    </span>
                  </div>
                  <Progress value={getMetricProgress(metrics.cls, 'cls')} className="h-2" />
                  <p className="text-xs text-gray-500">累积布局偏移</p>
                </div>
              )}

              {metrics.fid !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">FID</span>
                    <span className={cn('text-sm font-semibold', getMetricColor(getMetricGrade(metrics.fid, 'fid')))}>
                      {formatValue(metrics.fid, 'fid')}
                    </span>
                  </div>
                  <Progress value={getMetricProgress(metrics.fid, 'fid')} className="h-2" />
                  <p className="text-xs text-gray-500">首次输入延迟</p>
                </div>
              )}

              {metrics.ttfb !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">TTFB</span>
                    <span className={cn('text-sm font-semibold', getMetricColor(getMetricGrade(metrics.ttfb, 'ttfb')))}>
                      {formatValue(metrics.ttfb, 'ttfb')}
                    </span>
                  </div>
                  <Progress value={getMetricProgress(metrics.ttfb, 'ttfb')} className="h-2" />
                  <p className="text-xs text-gray-500">首字节时间</p>
                </div>
              )}
            </div>
          </div>
        )}

        {showAlerts && alerts.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold">性能告警</h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {alerts.slice().reverse().map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getAlertIcon(alert.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{alert.metric.toUpperCase()}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitorPanel;
