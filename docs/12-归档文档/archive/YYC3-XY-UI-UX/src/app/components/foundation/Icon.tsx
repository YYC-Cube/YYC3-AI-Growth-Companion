/**
 * Icon - 统一的图标组件
 * 支持emoji图标和自定义图标
 */

import React from 'react';

export interface IconProps {
  /** 图标内容（emoji或ReactNode） */
  icon: React.ReactNode;
  /** 大小 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** 颜色变体 */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  /** 是否为圆形背景 */
  circle?: boolean;
  /** 背景样式 */
  background?: 'solid' | 'soft' | 'outline' | 'none';
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  icon,
  size = 'md',
  variant = 'default',
  circle = false,
  background = 'none',
  className = '',
  onClick,
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-sm',
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-20 h-20 text-3xl',
  };

  const variantStyles = {
    default: {
      solid: 'bg-gray-500 text-white',
      soft: 'bg-gray-100 text-gray-700',
      outline: 'border-2 border-gray-300 text-gray-700',
      none: 'text-gray-700',
    },
    primary: {
      solid: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
      soft: 'bg-purple-100 text-purple-700',
      outline: 'border-2 border-purple-500 text-purple-600',
      none: 'text-purple-600',
    },
    secondary: {
      solid: 'bg-blue-500 text-white',
      soft: 'bg-blue-100 text-blue-700',
      outline: 'border-2 border-blue-500 text-blue-600',
      none: 'text-blue-600',
    },
    success: {
      solid: 'bg-green-500 text-white',
      soft: 'bg-green-100 text-green-700',
      outline: 'border-2 border-green-500 text-green-600',
      none: 'text-green-600',
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      soft: 'bg-yellow-100 text-yellow-700',
      outline: 'border-2 border-yellow-500 text-yellow-600',
      none: 'text-yellow-600',
    },
    danger: {
      solid: 'bg-red-500 text-white',
      soft: 'bg-red-100 text-red-700',
      outline: 'border-2 border-red-500 text-red-600',
      none: 'text-red-600',
    },
    info: {
      solid: 'bg-cyan-500 text-white',
      soft: 'bg-cyan-100 text-cyan-700',
      outline: 'border-2 border-cyan-500 text-cyan-600',
      none: 'text-cyan-600',
    },
  };

  const baseStyles = 'inline-flex items-center justify-center flex-shrink-0 transition-all duration-200';
  const shapeStyles = circle ? 'rounded-full' : 'rounded-lg';
  const interactiveStyles = onClick ? 'cursor-pointer hover:scale-110 hover:shadow-md' : '';

  return (
    <div
      className={`${baseStyles} ${sizeStyles[size]} ${shapeStyles} ${variantStyles[variant][background]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};
