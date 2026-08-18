/**
 * Badge - 徽章/标签组件
 * 用于状态标识、分类标签等
 */

import React from 'react';

export interface BadgeProps {
  /** 文本内容 */
  children: React.ReactNode;
  /** 颜色变体 */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  /** 大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 样式类型 */
  type?: 'solid' | 'soft' | 'outline';
  /** 是否为圆形 */
  rounded?: boolean;
  /** 前缀图标 */
  icon?: React.ReactNode;
  /** 是否可交互 */
  interactive?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  type = 'soft',
  rounded = true,
  icon,
  interactive = false,
  onClick,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variantStyles = {
    default: {
      solid: 'bg-gray-500 text-white',
      soft: 'bg-gray-100 text-gray-700',
      outline: 'border border-gray-300 text-gray-700 bg-transparent',
    },
    primary: {
      solid: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      soft: 'bg-purple-100 text-purple-700',
      outline: 'border border-purple-500 text-purple-600 bg-transparent',
    },
    secondary: {
      solid: 'bg-blue-500 text-white',
      soft: 'bg-blue-100 text-blue-700',
      outline: 'border border-blue-500 text-blue-600 bg-transparent',
    },
    success: {
      solid: 'bg-green-500 text-white',
      soft: 'bg-green-100 text-green-700',
      outline: 'border border-green-500 text-green-600 bg-transparent',
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      soft: 'bg-yellow-100 text-yellow-700',
      outline: 'border border-yellow-500 text-yellow-600 bg-transparent',
    },
    danger: {
      solid: 'bg-red-500 text-white',
      soft: 'bg-red-100 text-red-700',
      outline: 'border border-red-500 text-red-600 bg-transparent',
    },
    info: {
      solid: 'bg-cyan-500 text-white',
      soft: 'bg-cyan-100 text-cyan-700',
      outline: 'border border-cyan-500 text-cyan-600 bg-transparent',
    },
  };

  const baseStyles = 'inline-flex items-center gap-1 font-medium transition-all duration-200';
  const shapeStyles = rounded ? 'rounded-full' : 'rounded-lg';
  const interactiveStyles = (interactive || onClick) 
    ? 'cursor-pointer hover:shadow-md hover:scale-105' 
    : '';

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${shapeStyles} ${variantStyles[variant][type]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
};
