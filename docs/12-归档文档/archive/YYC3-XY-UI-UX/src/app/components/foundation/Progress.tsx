/**
 * Progress - 进度条组件
 * 用于展示任务进度、学习进度等
 */

import React from 'react';

export interface ProgressProps {
  /** 当前进度值 (0-100) */
  value: number;
  /** 总值 */
  max?: number;
  /** 显示文本 */
  label?: string;
  /** 显示百分比 */
  showPercentage?: boolean;
  /** 颜色变体 */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示动画 */
  animated?: boolean;
  /** 是否显示条纹 */
  striped?: boolean;
  /** 自定义类名 */
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
  animated = true,
  striped = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantStyles = {
    default: 'bg-gray-500',
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const stripedStyle = striped ? 'bg-stripes' : '';
  const animatedStyle = animated ? 'transition-all duration-500 ease-out' : '';

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} ${variantStyles[variant]} ${animatedStyle} ${stripedStyle} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * CircularProgress - 环形进度条
 */
export interface CircularProgressProps {
  /** 当前进度值 (0-100) */
  value: number;
  /** 大小 */
  size?: number;
  /** 线条粗细 */
  strokeWidth?: number;
  /** 颜色变体 */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** 显示文本 */
  showValue?: boolean;
  /** 自定义类名 */
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showValue = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorStyles = {
    default: 'stroke-gray-500',
    primary: 'stroke-purple-500',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* 进度圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorStyles[variant]} transition-all duration-500 ease-out`}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};
