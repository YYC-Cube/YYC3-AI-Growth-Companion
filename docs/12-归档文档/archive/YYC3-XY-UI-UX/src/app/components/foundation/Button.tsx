import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  children,
  className = '',
  rounded = 'lg',
}) => {
  const baseStyles = 'font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-105 focus:ring-purple-500',
    secondary: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md focus:ring-blue-500',
    outline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md focus:ring-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md focus:ring-green-500',
  };
  
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const roundedStyles = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };
  
  return (
    <button
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${roundedStyles[rounded]}
        ${fullWidth ? 'w-full' : ''} 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {icon && !loading && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {icon && !loading && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </button>
  );
};