/**
 * PageNavigation - 统一的页面导航栏组件
 * 提供返回按钮和主页按钮
 */

import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

export interface PageNavigationProps {
  /** 页面标题 */
  title: string;
  /** 页面图标（emoji或ReactNode） */
  icon?: React.ReactNode;
  /** 是否显示返回按钮 */
  showBackButton?: boolean;
  /** 是否显示主页按钮 */
  showHomeButton?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义返回按钮点击事件（覆盖默认行为） */
  onBackClick?: () => void;
  /** 自定义主页按钮点击事件（覆盖默认行为） */
  onHomeClick?: () => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  title,
  icon,
  showBackButton = true,
  showHomeButton = true,
  className = '',
  onBackClick,
  onHomeClick
}) => {
  const { goBack, goHome, canGoBack } = useNavigation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      goBack();
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      goHome();
    }
  };

  return (
    <div className={`bg-white shadow-sm sticky top-0 z-10 ${className}`}>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮 */}
          {showBackButton && (
            <button
              onClick={handleBackClick}
              disabled={!canGoBack && !onBackClick}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                canGoBack || onBackClick
                  ? 'bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 hover:from-purple-200 hover:to-blue-200 hover:scale-110 active:scale-95 shadow-sm'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="返回上一页"
            >
              <ArrowLeft className="w-6 h-6 stroke-2" />
            </button>
          )}

          {/* 中间：页面标题 */}
          <div className="flex-1 flex items-center justify-center gap-2 mx-4">
            {icon && (
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                {icon}
              </span>
            )}
            <h1 className="text-base sm:text-lg md:text-xl text-gray-900 font-bold truncate">
              {title}
            </h1>
          </div>

          {/* 右侧：主页按钮 */}
          {showHomeButton && (
            <button
              onClick={handleHomeClick}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="返回主页"
            >
              <Home className="w-5 h-5 stroke-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 简化版页面导航栏（仅文本按钮）
 */
export interface SimplePageNavigationProps {
  title: string;
  icon?: React.ReactNode;
  onBack?: () => void;
}

export const SimplePageNavigation: React.FC<SimplePageNavigationProps> = ({
  title,
  icon,
  onBack
}) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="返回"
            >
              ← 返回
            </button>
          )}
          <div className="flex items-center gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <h1 className="text-gray-900">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
