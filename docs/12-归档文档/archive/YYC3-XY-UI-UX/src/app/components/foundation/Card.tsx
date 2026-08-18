import React from 'react';

export interface CardProps {
  /** 标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 图片 */
  image?: string;
  /** 操作按钮 */
  actions?: React.ReactNode;
  /** 点击事件 */
  onClick?: () => void;
  /** 是否可hover */
  hoverable?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 圆角大小 */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** 内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** 颜色变体 */
  variant?: 'default' | 'gradient' | 'outline';
  /** 自定义类名 */
  className?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  actions,
  onClick,
  hoverable = true,
  bordered = false,
  rounded = 'xl',
  padding = 'md',
  variant = 'default',
  className = '',
  children,
}) => {
  const roundedStyles = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'bg-white shadow-md',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 shadow-md',
    outline: 'bg-transparent border-2 border-gray-200',
  };

  const hoverStyles = hoverable 
    ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' 
    : '';
  
  const clickStyles = onClick ? 'cursor-pointer' : '';
  const borderStyles = bordered ? 'border border-gray-100' : '';

  return (
    <div
      className={`
        ${roundedStyles[rounded]}
        ${variantStyles[variant]}
        ${hoverStyles}
        ${clickStyles}
        ${borderStyles}
        overflow-hidden
        ${className}
      `}
      onClick={onClick}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className={paddingStyles[padding]}>
        {title && (
          <h3 className="mb-1">{title}</h3>
        )}
        {subtitle && (
          <p className="text-gray-600 text-sm mb-2">{subtitle}</p>
        )}
        {children}
        {actions && (
          <div className="mt-4 flex gap-2 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};