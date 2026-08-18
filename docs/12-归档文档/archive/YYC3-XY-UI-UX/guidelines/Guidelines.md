# 小语AI应用全链路UI/UX设计

文档版本: V1.0
创建日期: 2025-12-26
文档类型: 架构类-UI/UX设计规划
适用范围: 小语AI应用全链路UI/UX设计
---
目录
1. 文档概述
2. 全局页面组件体系
3. 分层式架构体系
4. AI弹窗独立自治系统
5. 全链路闭环系统
6. API接口体系
7. 用户信息及全局形象系统
8. 信息映射系统
9. 技术实现规范
10. 设计规范与标准
---
一、文档概述
1.1 设计目标
本设计规划旨在为小语AI应用提供完整、系统、可落地的UI/UX设计方案，实现以下核心目标：
• 全局统一性: 确保所有页面组件遵循统一的设计语言和交互规范
• 分层清晰性: 采用五层架构模型，实现组件的层次化管理和复用
• AI弹窗自治: AI浮窗作为独立自治系统，具备完整的交互能力和状态管理
• 全链路闭环: 从用户进入应用到完成交互的完整流程闭环设计
• 智能适配性: 根据用户年龄、成长阶段、文化背景智能适配内容和界面
1.2 设计原则
遵循YYC³「五高五标五化」标准：
五高 (Five Highs):
• 高可用: 组件可复用性≥90%，交互响应时间≤200ms
• 高性能: 页面加载时间≤2s，动画帧率≥60fps
• 高安全: 用户数据加密存储，权限分级管理
• 高扩展: 组件化设计，支持动态加载和按需渲染
• 高维护: 代码注释覆盖率≥80%，文档完整度100%
五标 (Five Standards):
• 标准化: 组件命名、样式、交互遵循统一规范
• 规范化: 设计稿、代码、文档三同步
• 自动化: 组件自动生成、测试、部署
• 智能化: AI辅助设计、智能推荐、自适应布局
• 可视化: 设计系统可视化、组件库可视化
五化 (Five Transformations):
• 流程化: 设计流程标准化、可追溯
• 文档化: 所有设计决策有文档记录
• 工具化: 设计工具链完整集成
• 数字化: 设计资产数字化管理
• 生态化: 设计系统可扩展、可演进
1.3 设计范围
本设计规划覆盖以下核心系统：
系统名称
设计内容
关键特性

全局页面组件体系
基础组件、业务组件、页面组件、系统组件
组件化、可复用、可配置

分层式架构体系
五层架构模型、组件层级关系
层次清晰、职责明确

AI弹窗独立自治系统
AI浮窗、语音交互、智能推荐
独立运行、状态自治

全链路闭环系统
用户旅程、交互流程、数据流转
流程完整、数据闭环

API接口体系
接口设计、数据结构、通信协议
标准化、可扩展

用户信息及全局形象系统
用户画像、成长记录、形象展示
个性化、成长性

信息映射系统
内容映射、年龄适配、文化融合
智能匹配、精准推送

---
二、全局页面组件体系
2.1 组件体系架构
┌─────────────────────────────────────────────────────────────┐
│                     系统组件层 (System Layer)               │
│  AI浮窗、全局导航、主题切换、权限控制、通知中心              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     页面组件层 (Page Layer)                   │
│  首页、成长记录、文化探索、学习中心、个人中心                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    业务组件层 (Business Layer)                │
│  成长卡片、文化轮播、学习进度、成就徽章、社交互动             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    基础组件层 (Foundation Layer)              │
│  按钮、输入框、卡片、列表、弹窗、加载器、提示框               │
└─────────────────────────────────────────────────────────────┘2.2 基础组件层 (Foundation Layer)
2.2.1 按钮组件 (Button)
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  onClick,
  children,
  className = '',
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoadingSpinner size="small" />}
      {icon && !loading && <span className="icon">{icon}</span>}
      {children}
    </button>
  );
};2.2.2 卡片组件 (Card)
export interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  actions,
  onClick,
  hoverable = true,
  className = '',
  children,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
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
      <div className="p-4">
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {subtitle}
          </Typography>
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
};2.2.3 输入框组件 (Input)
export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  icon,
  className = '',
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className={`relative flex items-center border-2 rounded-lg transition-all duration-200 ${focused ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-300'} ${error ? 'border-red-500' : ''}`}>
        {icon && (
          <span className="absolute left-3 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`w-full px-4 py-2.5 outline-none ${icon ? 'pl-10' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};2.2.4 加载器组件 (LoadingSpinner)
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#9333EA',
  className = '',
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeMap[size]}`}
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};2.2.5 提示框组件 (Toast)
export interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const typeConfig = {
    success: {
      icon: '✓',
      bgColor: 'bg-green-500',
      textColor: 'text-white',
    },
    error: {
      icon: '✕',
      bgColor: 'bg-red-500',
      textColor: 'text-white',
    },
    warning: {
      icon: '⚠',
      bgColor: 'bg-yellow-500',
      textColor: 'text-white',
    },
    info: {
      icon: 'ℹ',
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
    },
  };
  
  const config = typeConfig[type];
  
  if (!visible) return null;
  
  return (
    <div className={`fixed top-4 right-4 ${config.bgColor} ${config.textColor} px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        <span className="text-xl font-bold">{config.icon}</span>
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};2.3 业务组件层 (Business Layer)
2.3.1 成长卡片组件 (GrowthCard)
export interface GrowthCardProps {
  ageStage: string;
  growthData: GrowthRecord;
  onViewDetails?: () => void;
  onEdit?: () => void;
  className?: string;
}

export interface GrowthRecord {
  id: string;
  age: number;
  stage: string;
  dimensions: {
    name: string;
    progress: number;
    items: GrowthItem[];
  }[];
  achievements: Achievement[];
  lastUpdated: string;
}

export interface GrowthItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earnedDate: string;
}

export const GrowthCard: React.FC<GrowthCardProps> = ({
  ageStage,
  growthData,
  onViewDetails,
  onEdit,
  className = '',
}) => {
  const overallProgress = useMemo(() => {
    const totalItems = growthData.dimensions.reduce((sum, dim) => sum + dim.items.length, 0);
    const completedItems = growthData.dimensions.reduce((sum, dim) => sum + dim.items.filter(item => item.completed).length, 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [growthData]);
  
  return (
    <Card className={`growth-card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {growthData.age}
          </div>
          <div>
            <Typography variant="h6">{ageStage}</Typography>
            <Typography variant="body2" color="textSecondary">
              最后更新: {new Date(growthData.lastUpdated).toLocaleDateString('zh-CN')}
            </Typography>
          </div>
        </div>
        <div className="text-right">
          <Typography variant="h4" color="primary">
            {overallProgress}%
          </Typography>
          <Typography variant="caption">总体进度</Typography>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {growthData.dimensions.slice(0, 3).map((dimension, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{dimension.name}</span>
              <span>{dimension.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dimension.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {growthData.achievements.length > 0 && (
        <div className="flex gap-2 mb-4">
          {growthData.achievements.slice(0, 4).map((achievement) => (
            <Tooltip key={achievement.id} title={achievement.title}>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                {achievement.icon}
              </div>
            </Tooltip>
          ))}
          {growthData.achievements.length > 4 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
              +{growthData.achievements.length - 4}
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" size="small" onClick={onViewDetails} fullWidth>
          查看详情
        </Button>
        <Button variant="ghost" size="small" onClick={onEdit}>
          编辑
        </Button>
      </div>
    </Card>
  );
};2.3.2 文化轮播组件 (CultureCarousel)
export interface CultureCarouselProps {
  items: CultureItem[];
  autoplay?: boolean;
  interval?: number;
  onItemClick?: (item: CultureItem) => void;
  className?: string;
}

export interface CultureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
}

export const CultureCarousel: React.FC<CultureCarouselProps> = ({
  items,
  autoplay = true,
  interval = 5000,
  onItemClick,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoplay, interval, items.length]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };
  
  const currentItem = items[currentIndex];
  
  return (
    <div className={`culture-carousel ${className}`}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={currentItem.image}
          alt={currentItem.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
            color: 'white',
          }}
        >
          <Typography variant="h5" gutterBottom style={{ color: 'white' }}>
            {currentItem.title}
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {currentItem.description}
          </Typography>
          {currentItem.tags && (
            <div className="flex gap-2 mt-2">
              {currentItem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/20 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          ‹
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          ›
        </button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};2.3.3 学习进度组件 (LearningProgress)
export interface LearningProgressProps {
  subject: string;
  progress: number;
  lessons: Lesson[];
  currentLesson?: Lesson;
  onContinue?: () => void;
  className?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  locked: boolean;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  subject,
  progress,
  lessons,
  currentLesson,
  onContinue,
  className = '',
}) => {
  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  
  return (
    <div className={`learning-progress ${className}`}>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6">{subject}</Typography>
          <Typography variant="body2" color="textSecondary">
            {completedLessons}/{totalLessons} 课时
          </Typography>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>学习进度</span>
            <span className="font-semibold text-purple-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {currentLesson && (
          <div className="mb-4 p-4 bg-purple-50 rounded-lg">
            <Typography variant="subtitle2" gutterBottom>
              当前课程
            </Typography>
            <Typography variant="h6" gutterBottom>
              {currentLesson.title}
            </Typography>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>⏱ {currentLesson.duration}分钟</span>
              <span>📚 进行中</span>
            </div>
          </div>
        )}
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {lessons.slice(0, 5).map((lesson, index) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${lesson.completed ? 'bg-green-50' : lesson.locked ? 'bg-gray-50 opacity-60' : 'bg-white'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-green-500 text-white' : lesson.locked ? 'bg-gray-300 text-gray-600' : 'bg-purple-100 text-purple-600'}`}>
                {lesson.completed ? '✓' : lesson.locked ? '🔒' : index + 1}
              </div>
              <div className="flex-1">
                <Typography variant="body2" className={lesson.locked ? 'text-gray-500' : ''}>
                  {lesson.title}
                </Typography>
              </div>
              <Typography variant="caption" color="textSecondary">
                {lesson.duration}分钟
              </Typography>
            </div>
          ))}
        </div>
        
        {onContinue && currentLesson && (
          <Button
            variant="primary"
            fullWidth
            onClick={onContinue}
            className="mt-4"
          >
            继续学习
          </Button>
        )}
      </div>
    </div>
  );
};2.3.4 成就徽章组件 (AchievementBadge)
export interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'medium',
  showTooltip = true,
  onClick,
  className = '',
}) => {
  const sizeMap = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-2xl',
    large: 'w-16 h-16 text-3xl',
  };
  
  const badge = (
    <div
      className={`achievement-badge ${sizeMap[size]} rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform ${className}`}
      onClick={onClick}
    >
      <span>{achievement.icon}</span>
    </div>
  );
  
  if (showTooltip) {
    return (
      <Tooltip title={`${achievement.title} - ${new Date(achievement.earnedDate).toLocaleDateString('zh-CN')}`}>
        {badge}
      </Tooltip>
    );
  }
  
  return badge;
};2.3.5 社交互动组件 (SocialInteraction)
export interface SocialInteractionProps {
  postId: string;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  className?: string;
}

export const SocialInteraction: React.FC<SocialInteractionProps> = ({
  postId,
  likes,
  comments,
  shares,
  liked = false,
  onLike,
  onComment,
  onShare,
  className = '',
}) => {
  return (
    <div className={`social-interaction flex items-center gap-4 ${className}`}>
      <button
        onClick={onLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        <span className="text-xl">{liked ? '❤' : '🤍'}</span>
        <span className="font-medium">{likes}</span>
      </button>
      
      <button
        onClick={onComment}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <span className="text-xl">💬</span>
        <span className="font-medium">{comments}</span>
      </button>
      
      <button
        onClick={onShare}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <span className="text-xl">📤</span>
        <span className="font-medium">{shares}</span>
      </button>
    </div>
  );
};2.4 页面组件层 (Page Layer)
2.4.1 首页组件 (HomePage)
export interface HomePageProps {
  userData: UserData;
  growthData: GrowthRecord;
  cultureItems: CultureItem[];
  learningProgress: LearningProgress[];
  recommendations: Recommendation[];
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  userData,
  growthData,
  cultureItems,
  learningProgress,
  recommendations,
  onNavigate,
}) => {
  return (
    <div className="home-page">
      <Header userData={userData} />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection userData={userData} />
        
        <section className="mb-8">
          <SectionTitle title="成长记录" onMore={() => onNavigate('growth')} />
          <GrowthCard
            ageStage={growthData.stage}
            growthData={growthData}
            onViewDetails={() => onNavigate('growth')}
          />
        </section>
        
        <section className="mb-8">
          <SectionTitle title="河洛文化探索" onMore={() => onNavigate('culture')} />
          <CultureCarousel items={cultureItems} />
        </section>
        
        <section className="mb-8">
          <SectionTitle title="学习进度" onMore={() => onNavigate('learning')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningProgress.map((progress, index) => (
              <LearningProgress key={index} {...progress} />
            ))}
          </div>
        </section>
        
        <section className="mb-8">
          <SectionTitle title="为你推荐" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};2.4.2 成长记录页组件 (GrowthPage)
export interface GrowthPageProps {
  growthData: GrowthRecord[];
  selectedAge?: number;
  onSelectAge: (age: number) => void;
  onEditRecord: (recordId: string) => void;
}

export const GrowthPage: React.FC<GrowthPageProps> = ({
  growthData,
  selectedAge,
  onSelectAge,
  onEditRecord,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'cards'>('cards');
  
  return (
    <div className="growth-page">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <PageTitle title="成长记录" subtitle="记录每一个成长的瞬间" />
        
        <div className="mb-6">
          <AgeSelector
            ages={growthData.map(d => d.age)}
            selectedAge={selectedAge}
            onSelectAge={onSelectAge}
          />
        </div>
        
        <div className="mb-6 flex justify-end">
          <ViewToggle
            mode={viewMode}
            onChange={setViewMode}
          />
        </div>
        
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {growthData.map((data, index) => (
              <GrowthCard
                key={index}
                ageStage={data.stage}
                growthData={data}
                onViewDetails={() => onSelectAge(data.age)}
                onEdit={() => onEditRecord(data.id)}
              />
            ))}
          </div>
        ) : (
          <GrowthTimeline growthData={growthData} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};2.4.3 文化探索页组件 (CulturePage)
export interface CulturePageProps {
  cultureItems: CultureItem[];
  categories: CultureCategory[];
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
  onItemClick: (item: CultureItem) => void;
}

export const CulturePage: React.FC<CulturePageProps> = ({
  cultureItems,
  categories,
  selectedCategory,
  onSelectCategory,
  onItemClick,
}) => {
  const filteredItems = selectedCategory
    ? cultureItems.filter(item => item.category === selectedCategory)
    : cultureItems;
  
  return (
    <div className="culture-page">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <PageTitle title="河洛文化探索" subtitle="探索洛阳千年文化底蕴" />
        
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <CultureCard
              key={index}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};2.5 系统组件层 (System Layer)
2.5.1 AI浮窗组件 (AIFloatWindow)
export interface AIFloatWindowProps {
  initialPosition?: { x: number; y: number };
  size?: { width: number; height: number };
  theme?: 'light' | 'dark';
  onInteraction?: (type: string, data?: any) => void;
  className?: string;
}

export const AIFloatWindow: React.FC<AIFloatWindowProps> = ({
  initialPosition = { x: 100, y: 100 },
  size = { width: 60, height: 60 },
  theme = 'light',
  onInteraction,
  className = '',
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const floatWindowRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onInteraction?.('toggle-expanded', { expanded: !isExpanded });
  };
  
  const handleVoiceClick = () => {
    setIsListening(!isListening);
    onInteraction?.('voice-click', { listening: !isListening });
  };
  
  return (
    <motion.div
      ref={floatWindowRef}
      className={`ai-float-window theme-${theme} ${className}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: isExpanded ? 320 : size.width,
        height: isExpanded ? 480 : size.height,
        zIndex: 9999,
        borderRadius: isExpanded ? '16px' : '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        background: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseDown={handleMouseDown}
    >
      {isExpanded ? (
        <div className="float-window-expanded h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                🤖
              </div>
              <div>
                <Typography variant="subtitle1">小语AI助手</Typography>
                <Typography variant="caption" color="textSecondary">
                  {isListening ? '正在聆听...' : '随时为您服务'}
                </Typography>
              </div>
            </div>
            <IconButton onClick={toggleExpanded}>
              ✕
            </IconButton>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <ChatMessageList />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                placeholder="输入消息..."
                className="flex-1"
              />
              <VoiceButton
                isListening={isListening}
                onClick={handleVoiceClick}
              />
              <Button variant="primary" size="small">
                发送
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="float-window-minimized w-full h-full flex items-center justify-center cursor-pointer" onClick={toggleExpanded}>
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
              🤖
            </div>
            <NotificationBadge count={3} />
          </div>
        </div>
      )}
    </motion.div>
  );
};2.5.2 全局导航组件 (GlobalNavigation)
export interface GlobalNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  className?: string;
}

export const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  currentPage,
  onNavigate,
  className = '',
}) => {
  const navItems = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'growth', label: '成长记录', icon: '📊' },
    { id: 'culture', label: '文化探索', icon: '🏛' },
    { id: 'learning', label: '学习中心', icon: '📚' },
    { id: 'profile', label: '个人中心', icon: '👤' },
  ];
  
  return (
    <nav className={`global-navigation fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${currentPage === item.id ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};2.5.3 主题切换组件 (ThemeToggle)
export interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: (theme: 'light' | 'dark') => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
}) => {
  return (
    <button
      onClick={() => onToggle(theme === 'light' ? 'dark' : 'light')}
      className={`theme-toggle w-10 h-10 rounded-full flex items-center justify-center transition-all ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'} ${className}`}
    >
      <span className="text-xl">{theme === 'light' ? '☀' : '🌙'}</span>
    </button>
  );
};2.5.4 通知中心组件 (NotificationCenter)
export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  className?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className={`notification-center relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <NotificationBadge count={unreadCount} />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
          <div className="p-4 border-b flex items-center justify-between">
            <Typography variant="subtitle1">通知中心</Typography>
            <Button variant="ghost" size="small" onClick={onClearAll}>
              清空全部
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>暂无通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => onMarkAsRead(notification.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};---
三、分层式架构体系
3.1 五层架构模型
小语AI应用采用五层架构模型，确保组件层次清晰、职责明确、易于维护。
┌─────────────────────────────────────────────────────────────┐
│                  应用层 (Application Layer)                  │
│  应用入口、路由配置、全局状态管理、主题配置                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   页面层 (Page Layer)                         │
│  页面级组件、页面布局、页面状态管理、页面交互逻辑             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   布局层 (Layout Layer)                       │
│  页面布局组件、响应式布局、导航栏、侧边栏、底部栏              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  组件层 (Component Layer)                     │
│  业务组件、复合组件、功能组件、UI组件                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  基础层 (Foundation Layer)                    │
│  基础UI组件、工具函数、常量定义、类型定义                     │
└─────────────────────────────────────────────────────────────┘3.2 应用层 (Application Layer)
3.2.1 应用入口 (App Entry)
// src/app/layout.tsx
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AIFloatWindow } from '@/components/AIFloatWindow';
import { GlobalNavigation } from '@/components/GlobalNavigation';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Provider store={store}>
          <ThemeProvider>
            {children}
            <AIFloatWindow />
            <GlobalNavigation />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}3.2.2 路由配置 (Router Configuration)
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import GrowthPage from '@/pages/GrowthPage';
import CulturePage from '@/pages/CulturePage';
import LearningPage from '@/pages/LearningPage';
import ProfilePage from '@/pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/growth',
    element: <GrowthPage />,
  },
  {
    path: '/culture',
    element: <CulturePage />,
  },
  {
    path: '/learning',
    element: <LearningPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
]);3.2.3 全局状态管理 (Global State Management)
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import aiReducer from './slices/aiSlice';
import growthReducer from './slices/growthSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    ai: aiReducer,
    growth: growthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;3.3 页面层 (Page Layer)
3.3.1 页面组件规范
所有页面组件必须遵循以下规范：
1. 文件命名: 采用PascalCase，如HomePage.tsx
2. Props接口: 定义明确的Props接口，使用TypeScript类型
3. 状态管理: 使用React Hooks或Redux进行状态管理
4. 生命周期: 使用useEffect处理副作用
5. 错误处理: 实现错误边界和错误处理逻辑
// src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserData } from '@/store/slices/userSlice';
import { fetchGrowthData } from '@/store/slices/growthSlice';
import { Header } from '@/components/Header';
import { WelcomeSection } from '@/components/WelcomeSection';
import { GrowthCard } from '@/components/GrowthCard';
import { CultureCarousel } from '@/components/CultureCarousel';
import { LearningProgress } from '@/components/LearningProgress';
import { RecommendationCard } from '@/components/RecommendationCard';
import { SectionTitle } from '@/components/SectionTitle';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, loading: userLoading } = useSelector((state: RootState) => state.user);
  const { growthData, loading: growthLoading } = useSelector((state: RootState) => state.growth);
  
  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchGrowthData());
  }, [dispatch]);
  
  if (userLoading || growthLoading) {
    return <LoadingPage />;
  }
  
  return (
    <div className="home-page">
      <Header userData={userData} />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeSection userData={userData} />
        
        <section className="mb-8">
          <SectionTitle title="成长记录" onMore={() => {}} />
          <GrowthCard
            ageStage={growthData.stage}
            growthData={growthData}
            onViewDetails={() => {}}
          />
        </section>
        
        <section className="mb-8">
          <SectionTitle title="河洛文化探索" onMore={() => {}} />
          <CultureCarousel items={[]} />
        </section>
        
        <section className="mb-8">
          <SectionTitle title="学习进度" onMore={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LearningProgress subject="语文" progress={75} lessons={[]} />
            <LearningProgress subject="数学" progress={60} lessons={[]} />
            <LearningProgress subject="英语" progress={45} lessons={[]} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}3.4 布局层 (Layout Layer)
3.4.1 响应式布局组件
// src/components/layouts/ResponsiveLayout.tsx
export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  maxWidth = 'lg',
  padding = true,
  className = '',
}) => {
  const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };
  
  return (
    <div className={`responsive-layout mx-auto ${maxWidthMap[maxWidth]} ${padding ? 'px-4' : ''} ${className}`}>
      {children}
    </div>
  );
};3.4.2 网格布局组件
// src/components/layouts/GridLayout.tsx
export interface GridLayoutProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  cols = 1,
  gap = 4,
  responsive,
  className = '',
}) => {
  const getGridClasses = () => {
    let classes = `grid gap-${gap}`;
    
    if (responsive) {
      classes += ` grid-cols-${responsive.sm || 1}`;
      classes += ` md:grid-cols-${responsive.md || cols}`;
      classes += ` lg:grid-cols-${responsive.lg || cols}`;
      classes += ` xl:grid-cols-${responsive.xl || cols}`;
    } else {
      classes += ` grid-cols-${cols}`;
    }
    
    return classes;
  };
  
  return (
    <div className={getGridClasses()}>
      {children}
    </div>
  );
};3.5 组件层 (Component Layer)
3.5.1 组件分类
组件层分为以下几类：
组件类型
说明
示例

业务组件
与具体业务逻辑相关的组件
GrowthCard, LearningProgress

复合组件
由多个基础组件组合而成
CultureCarousel, SocialInteraction

功能组件
实现特定功能的组件
AIFloatWindow, NotificationCenter

UI组件
纯UI展示组件
Button, Card, Input

3.5.2 组件开发规范
所有组件必须遵循以下规范：
1. Props接口: 使用TypeScript定义明确的Props接口
2. 默认值: 为可选Props提供合理的默认值
3. 样式: 使用Tailwind CSS或styled-components
4. 可访问性: 遵循WCAG 2.1标准
5. 测试: 编写单元测试和集成测试
// src/components/GrowthCard.tsx
import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Typography } from './Typography';
import { Tooltip } from './Tooltip';

export interface GrowthCardProps {
  ageStage: string;
  growthData: GrowthRecord;
  onViewDetails?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const GrowthCard: React.FC<GrowthCardProps> = ({
  ageStage,
  growthData,
  onViewDetails,
  onEdit,
  className = '',
}) => {
  return (
    <Card className={`growth-card ${className}`}>
    </Card>
  );
};3.6 基础层 (Foundation Layer)
3.6.1 基础UI组件
基础层提供所有基础UI组件，包括：
• Button（按钮）
• Input（输入框）
• Card（卡片）
• List（列表）
• Modal（弹窗）
• Loading（加载器）
• Toast（提示框）
• Tooltip（工具提示）
3.6.2 工具函数
// src/utils/helpers.ts
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN');
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateProgress = (completed: number, total: number): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};3.6.3 类型定义
// src/types/index.ts
export interface User {
  id: string;
  name: string;
  age: number;
  avatar: string;
  growthStage: string;
}

export interface GrowthRecord {
  id: string;
  age: number;
  stage: string;
  dimensions: GrowthDimension[];
  achievements: Achievement[];
  lastUpdated: string;
}

export interface GrowthDimension {
  name: string;
  progress: number;
  items: GrowthItem[];
}

export interface GrowthItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  earnedDate: string;
}

export interface CultureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  locked: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}---
四、AI弹窗独立自治系统
4.1 系统架构
AI弹窗独立自治系统是一个完全独立的子系统，具备完整的交互能力、状态管理和智能推荐功能。
┌─────────────────────────────────────────────────────────────┐
│                    AI弹窗独立自治系统                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │              交互层 (Interaction Layer)              │   │
│  │  语音交互、文本交互、手势交互、表情交互               │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              状态层 (State Layer)                     │   │
│  │  展开/收起状态、位置状态、对话状态、监听状态         │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              智能层 (Intelligence Layer)               │   │
│  │  智能推荐、上下文理解、意图识别、情感分析             │   │
│  └──────────────────────────────────────────────────────┘   │
│                              │                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              数据层 (Data Layer)                      │   │
│  │  对话历史、用户画像、知识库、配置参数                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘4.2 交互层 (Interaction Layer)
4.2.1 语音交互组件
// src/components/ai/VoiceInteraction.tsx
export interface VoiceInteractionProps {
  onVoiceInput: (text: string) => void;
  onError: (error: Error) => void;
  className?: string;
}

export const VoiceInteraction: React.FC<VoiceInteractionProps> = ({
  onVoiceInput,
  onError,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onVoiceInput(finalTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        onError(new Error(event.error));
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [onVoiceInput, onError]);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };
  
  return (
    <div className={`voice-interaction ${className}`}>
      <button
        onClick={toggleListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-purple-500 hover:bg-purple-600'}`}
      >
        <span className="text-3xl text-white">
          {isListening ? '🎤' : '🎙'}
        </span>
      </button>
      {transcript && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          {transcript}
        </div>
      )}
    </div>
  );
};4.2.2 文本交互组件
// src/components/ai/TextInteraction.tsx
export interface TextInteractionProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const TextInteraction: React.FC<TextInteractionProps> = ({
  onSend,
  placeholder = '输入消息...',
  disabled = false,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className={`text-interaction flex items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
      />
      <Button
        variant="primary"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
      >
        发送
      </Button>
    </div>
  );
};4.3 状态层 (State Layer)
4.3.1 AI弹窗状态管理
// src/store/slices/aiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AIState {
  isExpanded: boolean;
  position: { x: number; y: number };
  isListening: boolean;
  messages: ChatMessage[];
  context: AIContext;
  recommendations: Recommendation[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'image';
}

export interface AIContext {
  currentAge: number;
  currentStage: string;
  recentTopics: string[];
  userPreferences: Record<string, any>;
}

export interface Recommendation {
  id: string;
  type: 'content' | 'action' | 'question';
  title: string;
  description: string;
  action?: () => void;
}

const initialState: AIState = {
  isExpanded: false,
  position: { x: 100, y: 100 },
  isListening: false,
  messages: [],
  context: {
    currentAge: 0,
    currentStage: '',
    recentTopics: [],
    userPreferences: {},
  },
  recommendations: [],
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.isExpanded = action.payload;
    },
    setPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.position = action.payload;
    },
    setListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setContext: (state, action: PayloadAction<Partial<AIContext>>) => {
      state.context = { ...state.context, ...action.payload };
    },
    setRecommendations: (state, action: PayloadAction<Recommendation[]>) => {
      state.recommendations = action.payload;
    },
  },
});

export const {
  toggleExpanded,
  setExpanded,
  setPosition,
  setListening,
  addMessage,
  clearMessages,
  setContext,
  setRecommendations,
} = aiSlice.actions;

export default aiSlice.reducer;4.4 智能层 (Intelligence Layer)
4.4.1 智能推荐引擎
// src/services/ai/recommendationEngine.ts
export class RecommendationEngine {
  private userContext: AIContext;
  private knowledgeBase: KnowledgeBase;
  
  constructor(userContext: AIContext, knowledgeBase: KnowledgeBase) {
    this.userContext = userContext;
    this.knowledgeBase = knowledgeBase;
  }
  
  generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    const ageBasedRecommendations = this.getAgeBasedRecommendations();
    const topicBasedRecommendations = this.getTopicBasedRecommendations();
    const preferenceBasedRecommendations = this.getPreferenceBasedRecommendations();
    
    recommendations.push(...ageBasedRecommendations);
    recommendations.push(...topicBasedRecommendations);
    recommendations.push(...preferenceBasedRecommendations);
    
    return this.rankRecommendations(recommendations);
  }
  
  private getAgeBasedRecommendations(): Recommendation[] {
    const age = this.userContext.currentAge;
    const stage = this.userContext.currentStage;
    
    return this.knowledgeBase
      .getContentByAge(age)
      .map((content) => ({
        id: content.id,
        type: 'content' as const,
        title: content.title,
        description: content.description,
      }));
  }
  
  private getTopicBasedRecommendations(): Recommendation[] {
    const recentTopics = this.userContext.recentTopics;
    
    return this.knowledgeBase
      .getRelatedContent(recentTopics)
      .map((content) => ({
        id: content.id,
        type: 'content' as const,
        title: content.title,
        description: content.description,
      }));
  }
  
  private getPreferenceBasedRecommendations(): Recommendation[] {
    const preferences = this.userContext.userPreferences;
    
    return this.knowledgeBase
      .getContentByPreferences(preferences)
      .map((content) => ({
        id: content.id,
        type: 'content' as const,
        title: content.title,
        description: content.description,
      }));
  }
  
  private rankRecommendations(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a);
      const scoreB = this.calculateRelevanceScore(b);
      return scoreB - scoreA;
    });
  }
  
  private calculateRelevanceScore(recommendation: Recommendation): number {
    let score = 0;
    
    if (recommendation.type === 'content') {
      score += 0.5;
    }
    
    if (this.userContext.recentTopics.some(topic => 
      recommendation.title.includes(topic)
    )) {
      score += 0.3;
    }
    
    return score;
  }
}4.4.2 意图识别引擎
// src/services/ai/intentRecognizer.ts
export class IntentRecognizer {
  private intents: IntentPattern[];
  
  constructor() {
    this.intents = [
      {
        intent: 'learn',
        patterns: ['学习', '教我', '如何', '怎么'],
      },
      {
        intent: 'play',
        patterns: ['玩', '游戏', '娱乐'],
      },
      {
        intent: 'explore',
        patterns: ['探索', '发现', '了解'],
      },
      {
        intent: 'record',
        patterns: ['记录', '保存', '添加'],
      },
      {
        intent: 'greeting',
        patterns: ['你好', '嗨', '早上好', '晚上好'],
      },
    ];
  }
  
  recognizeIntent(text: string): IntentResult {
    const lowerText = text.toLowerCase();
    
    for (const intentPattern of this.intents) {
      for (const pattern of intentPattern.patterns) {
        if (lowerText.includes(pattern)) {
          return {
            intent: intentPattern.intent,
            confidence: this.calculateConfidence(lowerText, pattern),
            entities: this.extractEntities(text, intentPattern.intent),
          };
        }
      }
    }
    
    return {
      intent: 'unknown',
      confidence: 0,
      entities: {},
    };
  }
  
  private calculateConfidence(text: string, pattern: string): number {
    if (text.includes(pattern)) {
      return 0.9;
    }
    return 0;
  }
  
  private extractEntities(text: string, intent: string): Record<string, string> {
    const entities: Record<string, string> = {};
    
    if (intent === 'learn') {
      const subjectMatch = text.match(/学习(.+)/);
      if (subjectMatch) {
        entities.subject = subjectMatch[1].trim();
      }
    }
    
    return entities;
  }
}

export interface IntentPattern {
  intent: string;
  patterns: string[];
}

export interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
}4.5 数据层 (Data Layer)
4.5.1 对话历史管理
// src/services/ai/chatHistoryManager.ts
export class ChatHistoryManager {
  private storageKey = 'ai_chat_history';
  private maxHistorySize = 100;
  
  saveMessage(message: ChatMessage): void {
    const history = this.getHistory();
    history.push(message);
    
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  }
  
  getHistory(): ChatMessage[] {
    const history = localStorage.getItem(this.storageKey);
    return history ? JSON.parse(history) : [];
  }
  
  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  getRecentMessages(count: number): ChatMessage[] {
    const history = this.getHistory();
    return history.slice(-count);
  }
}4.5.2 用户画像管理
// src/services/ai/userProfileManager.ts
export class UserProfileManager {
  private storageKey = 'ai_user_profile';
  
  getUserProfile(): UserProfile {
    const profile = localStorage.getItem(this.storageKey);
    return profile ? JSON.parse(profile) : this.createDefaultProfile();
  }
  
  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }
  
  updateProfile(updates: Partial<UserProfile>): void {
    const profile = this.getUserProfile();
    const updatedProfile = { ...profile, ...updates };
    this.saveUserProfile(updatedProfile);
  }
  
  private createDefaultProfile(): UserProfile {
    return {
      id: uuidv4(),
      name: '',
      age: 0,
      growthStage: '',
      recentTopics: [],
      userPreferences: {},
    };
  }
}

### 4.6 展示层 (Presentation Layer)

#### 4.6.1 AI浮窗UI组件

```typescript
export interface AIFloatingWindowProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark' | 'auto';
  onOpen?: () => void;
  onClose?: () => void;
}

export const AIFloatingWindow: React.FC<AIFloatingWindowProps> = ({
  position = 'bottom-right',
  size = 'medium',
  theme = 'auto',
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { aiState, dispatch } = useAIStore();
  
  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    } else {
      setIsOpen(true);
      onOpen?.();
    }
  };
  
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };
  
  const sizeStyles = {
    small: 'w-80 h-96',
    medium: 'w-96 h-[500px]',
    large: 'w-[500px] h-[600px]',
  };
  
  return (
    <div className={`fixed ${positionStyles[position]} z-50`}>
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white text-2xl hover:scale-110"
        >
          🤖
        </button>
      )}
      
      {isOpen && (
        <div
          className={`${sizeStyles[size]} bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${theme === 'dark' ? 'dark' : ''}`}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <Typography variant="h6" style={{ color: 'white' }}>小语AI助手</Typography>
                  <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    {aiState.isListening ? '正在聆听...' : aiState.isSpeaking ? '正在说话...' : '准备就绪'}
                  </Typography>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleMinimize}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  {isMinimized ? '□' : '_'}
                </button>
                <button
                  onClick={handleToggle}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 overflow-y-auto">
                {aiState.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block max-w-[80%] p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                    </div>
                  </div>
                ))}
                {aiState.isProcessing && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-2xl bg-gray-100">
                      <LoadingSpinner size="small" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex gap-2 mb-3">
                  <VoiceInputButton
                    isListening={aiState.isListening}
                    onStart={() => dispatch({ type: 'START_LISTENING' })}
                    onStop={() => dispatch({ type: 'STOP_LISTENING' })}
                  />
                  <TextInput
                    placeholder="输入消息..."
                    value={aiState.inputText}
                    onChange={(value) => dispatch({ type: 'SET_INPUT_TEXT', payload: value })}
                    onSend={() => dispatch({ type: 'SEND_MESSAGE' })}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {aiState.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => dispatch({ type: 'SEND_MESSAGE', payload: suggestion })}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm whitespace-nowrap hover:bg-purple-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};---
五、全链路闭环系统
5.1 用户旅程设计
5.1.1 用户旅程地图
用户旅程阶段：
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   首次访问   │   注册登录   │   探索内容   │   深度使用   │   持续成长   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
  引导页面      用户信息收集    内容推荐      个性化学习    成长追踪
  AI互动        成长阶段识别    智能适配      AI辅助        成就系统
  快速上手      个性化设置      文化探索      社交互动      数据分析5.1.2 用户旅程关键节点
阶段
关键节点
用户目标
系统响应
数据采集

首次访问
欢迎引导
了解应用功能
展示核心功能介绍
访问来源、设备信息

注册登录
信息收集
完成账号创建
收集基本信息
用户信息、年龄

探索内容
内容推荐
发现感兴趣内容
基于年龄推荐内容
浏览行为、停留时间

深度使用
个性化学习
获得个性化体验
AI辅助学习
学习进度、互动数据

持续成长
成长追踪
查看成长记录
展示成长数据
成就数据、使用频率

5.2 交互流程设计
5.2.1 核心交互流程
export interface InteractionFlow {
  id: string;
  name: string;
  description: string;
  steps: InteractionStep[];
  triggers: InteractionTrigger[];
  conditions?: InteractionCondition[];
  actions?: InteractionAction[];
}

export interface InteractionStep {
  id: string;
  name: string;
  type: 'user_action' | 'system_response' | 'ai_interaction';
  component?: string;
  data?: Record<string, any>;
  nextSteps?: string[];
}

export interface InteractionTrigger {
  type: 'event' | 'condition' | 'time' | 'user_intent';
  value: string | number | boolean;
  description: string;
}

export interface InteractionCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
  value: any;
}

export interface InteractionAction {
  type: 'navigate' | 'show_modal' | 'update_state' | 'send_event';
  target: string;
  data?: Record<string, any>;
}

export const coreInteractionFlows: InteractionFlow[] = [
  {
    id: 'onboarding_flow',
    name: '新手引导流程',
    description: '用户首次进入应用时的引导流程',
    steps: [
      {
        id: 'welcome_screen',
        name: '欢迎页面',
        type: 'system_response',
        component: 'WelcomeScreen',
        nextSteps: ['age_selection'],
      },
      {
        id: 'age_selection',
        name: '年龄选择',
        type: 'user_action',
        component: 'AgeSelection',
        nextSteps: ['growth_stage_identification'],
      },
      {
        id: 'growth_stage_identification',
        name: '成长阶段识别',
        type: 'system_response',
        component: 'GrowthStageIdentification',
        nextSteps: ['content_recommendation'],
      },
      {
        id: 'content_recommendation',
        name: '内容推荐',
        type: 'system_response',
        component: 'ContentRecommendation',
        nextSteps: ['ai_introduction'],
      },
      {
        id: 'ai_introduction',
        name: 'AI助手介绍',
        type: 'ai_interaction',
        component: 'AIIntroduction',
      },
    ],
    triggers: [
      {
        type: 'event',
        value: 'app_first_open',
        description: '应用首次打开',
      },
    ],
  },
  {
    id: 'learning_flow',
    name: '学习流程',
    description: '用户学习内容的完整流程',
    steps: [
      {
        id: 'content_selection',
        name: '内容选择',
        type: 'user_action',
        component: 'ContentSelection',
        nextSteps: ['content_display'],
      },
      {
        id: 'content_display',
        name: '内容展示',
        type: 'system_response',
        component: 'ContentDisplay',
        nextSteps: ['learning_interaction'],
      },
      {
        id: 'learning_interaction',
        name: '学习互动',
        type: 'user_action',
        component: 'LearningInteraction',
        nextSteps: ['ai_assistance'],
      },
      {
        id: 'ai_assistance',
        name: 'AI辅助',
        type: 'ai_interaction',
        component: 'AIAssistance',
        nextSteps: ['progress_update'],
      },
      {
        id: 'progress_update',
        name: '进度更新',
        type: 'system_response',
        component: 'ProgressUpdate',
      },
    ],
    triggers: [
      {
        type: 'user_intent',
        value: 'learn_content',
        description: '用户意图学习内容',
      },
    ],
  },
];5.2.2 交互状态管理
export interface InteractionState {
  currentFlow: string | null;
  currentStep: string | null;
  history: InteractionHistoryEntry[];
  context: Record<string, any>;
  isProcessing: boolean;
  error: string | null;
}

export interface InteractionHistoryEntry {
  flowId: string;
  stepId: string;
  timestamp: number;
  data?: Record<string, any>;
}

export class InteractionFlowManager {
  private state: InteractionState = {
    currentFlow: null,
    currentStep: null,
    history: [],
    context: {},
    isProcessing: false,
    error: null,
  };
  
  private flows: Map<string, InteractionFlow> = new Map();
  
  registerFlow(flow: InteractionFlow): void {
    this.flows.set(flow.id, flow);
  }
  
  startFlow(flowId: string, initialContext?: Record<string, any>): boolean {
    const flow = this.flows.get(flowId);
    if (!flow) {
      this.state.error = `Flow not found: ${flowId}`;
      return false;
    }
    
    this.state.currentFlow = flowId;
    this.state.currentStep = flow.steps[0].id;
    this.state.context = { ...initialContext };
    this.state.isProcessing = true;
    this.state.error = null;
    
    this.recordHistory(flowId, flow.steps[0].id);
    return true;
  }
  
  nextStep(): boolean {
    const { currentFlow, currentStep } = this.state;
    if (!currentFlow || !currentStep) return false;
    
    const flow = this.flows.get(currentFlow);
    if (!flow) return false;
    
    const currentStepIndex = flow.steps.findIndex(s => s.id === currentStep);
    if (currentStepIndex === -1) return false;
    
    const currentStepData = flow.steps[currentStepIndex];
    const nextStepIds = currentStepData.nextSteps;
    
    if (!nextStepIds || nextStepIds.length === 0) {
      this.endFlow();
      return true;
    }
    
    const nextStepId = nextStepIds[0];
    this.state.currentStep = nextStepId;
    this.recordHistory(currentFlow, nextStepId);
    
    return true;
  }
  
  endFlow(): void {
    this.state.currentFlow = null;
    this.state.currentStep = null;
    this.state.isProcessing = false;
  }
  
  updateContext(updates: Record<string, any>): void {
    this.state.context = { ...this.state.context, ...updates };
  }
  
  getState(): InteractionState {
    return { ...this.state };
  }
  
  private recordHistory(flowId: string, stepId: string): void {
    this.state.history.push({
      flowId,
      stepId,
      timestamp: Date.now(),
      data: { ...this.state.context },
    });
  }
}5.3 数据流转设计
5.3.1 数据流向图
用户输入
    │
    ▼
┌─────────────┐
│  前端组件层  │
└─────────────┘
    │
    ▼
┌─────────────┐
│  状态管理层  │ (Redux Store)
└─────────────┘
    │
    ├──────────────────┬──────────────────┐
    ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  AI服务层   │  │  内容服务层  │  │  用户服务层  │
└─────────────┘  └─────────────┘  └─────────────┘
    │                  │                  │
    └──────────────────┼──────────────────┘
                       ▼
              ┌─────────────┐
              │  API网关层  │
              └─────────────┘
                       │
                       ▼
              ┌─────────────┐
              │  后端服务层  │
              └─────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ PostgreSQL │  │  Redis  │  │  Qdrant │
   └─────────┘   └─────────┘   └─────────┘5.3.2 数据同步机制
export interface DataSyncConfig {
  syncInterval: number;
  retryAttempts: number;
  retryDelay: number;
  conflictResolution: 'client' | 'server' | 'merge';
}

export class DataSyncManager {
  private config: DataSyncConfig;
  private syncQueue: Map<string, any> = new Map();
  private isSyncing: boolean = false;
  
  constructor(config: DataSyncConfig) {
    this.config = config;
  }
  
  async syncData(key: string, data: any): Promise<boolean> {
    this.syncQueue.set(key, data);
    
    if (!this.isSyncing) {
      return this.processSyncQueue();
    }
    
    return true;
  }
  
  private async processSyncQueue(): Promise<boolean> {
    this.isSyncing = true;
    
    try {
      for (const [key, data] of this.syncQueue.entries()) {
        await this.syncItem(key, data);
        this.syncQueue.delete(key);
      }
      
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }
  
  private async syncItem(key: string, data: any): Promise<void> {
    let attempts = 0;
    
    while (attempts < this.config.retryAttempts) {
      try {
        await this.sendToServer(key, data);
        return;
      } catch (error) {
        attempts++;
        if (attempts < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay);
        } else {
          throw error;
        }
      }
    }
  }
  
  private async sendToServer(key: string, data: any): Promise<void> {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, data }),
    });
    
    if (!response.ok) {
      throw new Error('Sync request failed');
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}5.4 反馈闭环设计
5.4.1 用户反馈收集
export interface UserFeedback {
  id: string;
  userId: string;
  type: 'rating' | 'comment' | 'bug' | 'suggestion';
  category: string;
  content: string;
  rating?: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

export class FeedbackCollector {
  private feedbackQueue: UserFeedback[] = [];
  private isSubmitting: boolean = false;
  
  collectFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp'>): string {
    const fullFeedback: UserFeedback = {
      ...feedback,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    
    this.feedbackQueue.push(fullFeedback);
    this.submitFeedback();
    
    return fullFeedback.id;
  }
  
  async submitFeedback(): Promise<void> {
    if (this.isSubmitting || this.feedbackQueue.length === 0) {
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      const feedback = this.feedbackQueue.shift();
      if (feedback) {
        await this.sendFeedback(feedback);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
  
  private async sendFeedback(feedback: UserFeedback): Promise<void> {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    
    if (!response.ok) {
      throw new Error('Feedback submission failed');
    }
  }
}5.4.2 系统反馈机制
export interface SystemFeedback {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: FeedbackAction[];
}

export interface FeedbackAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

export class SystemFeedbackManager {
  private listeners: Set<(feedback: SystemFeedback) => void> = new Set();
  
  showFeedback(feedback: SystemFeedback): void {
    this.listeners.forEach(listener => listener(feedback));
  }
  
  success(title: string, message: string, actions?: FeedbackAction[]): void {
    this.showFeedback({
      type: 'success',
      title,
      message,
      actions,
    });
  }
  
  error(title: string, message: string, actions?: FeedbackAction[]): void {
    this.showFeedback({
      type: 'error',
      title,
      message,
      duration: 5000,
      actions,
    });
  }
  
  warning(title: string, message: string, actions?: FeedbackAction[]): void {
    this.showFeedback({
      type: 'warning',
      title,
      message,
      actions,
    });
  }
  
  info(title: string, message: string, actions?: FeedbackAction[]): void {
    this.showFeedback({
      type: 'info',
      title,
      message,
      actions,
    });
  }
  
  subscribe(listener: (feedback: SystemFeedback) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}---
六、API接口体系
6.1 接口架构设计
6.1.1 接口分层架构
┌─────────────────────────────────────────────────────────────┐
│                     API网关层 (API Gateway)                  │
│  路由转发、认证授权、限流熔断、日志监控                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  用户服务   │       │  内容服务   │       │  AI服务     │
│  User API   │       │ Content API │       │  AI API     │
└─────────────┘       └─────────────┘       └─────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  PostgreSQL │       │  PostgreSQL │       │  Qdrant     │
└─────────────┘       └─────────────┘       └─────────────┘6.1.2 接口规范
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
}

export class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  
  constructor(baseURL: string, defaultHeaders?: Record<string, string>) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }
  
  async request<T>(config: APIRequest): Promise<APIResponse<T>> {
    const url = new URL(config.url, this.baseURL);
    
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    const response = await fetch(url.toString(), {
      method: config.method,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data,
      timestamp: Date.now(),
    };
  }
  
  get<T>(url: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }
  
  post<T>(url: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'POST', url, body });
  }
  
  put<T>(url: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'PUT', url, body });
  }
  
  delete<T>(url: string): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }
}6.2 用户服务API
6.2.1 用户信息接口
export interface UserAPI {
  getUserProfile(userId: string): Promise<APIResponse<UserProfile>>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<APIResponse<UserProfile>>;
  createUserProfile(profile: Omit<UserProfile, 'id'>): Promise<APIResponse<UserProfile>>;
  deleteUserProfile(userId: string): Promise<APIResponse<void>>;
  getUserGrowthRecords(userId: string): Promise<APIResponse<GrowthRecord[]>>;
  updateUserGrowthRecord(userId: string, recordId: string, updates: Partial<GrowthRecord>): Promise<APIResponse<GrowthRecord>>;
}

export class UserService implements UserAPI {
  private client: APIClient;
  
  constructor(baseURL: string) {
    this.client = new APIClient(baseURL);
  }
  
  async getUserProfile(userId: string): Promise<APIResponse<UserProfile>> {
    return this.client.get<UserProfile>(`/api/users/${userId}`);
  }
  
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    return this.client.put<UserProfile>(`/api/users/${userId}`, updates);
  }
  
  async createUserProfile(profile: Omit<UserProfile, 'id'>): Promise<APIResponse<UserProfile>> {
    return this.client.post<UserProfile>('/api/users', profile);
  }
  
  async deleteUserProfile(userId: string): Promise<APIResponse<void>> {
    return this.client.delete<void>(`/api/users/${userId}`);
  }
  
  async getUserGrowthRecords(userId: string): Promise<APIResponse<GrowthRecord[]>> {
    return this.client.get<GrowthRecord[]>(`/api/users/${userId}/growth-records`);
  }
  
  async updateUserGrowthRecord(userId: string, recordId: string, updates: Partial<GrowthRecord>): Promise<APIResponse<GrowthRecord>> {
    return this.client.put<GrowthRecord>(`/api/users/${userId}/growth-records/${recordId}`, updates);
  }
}6.3 内容服务API
6.3.1 内容管理接口
export interface ContentAPI {
  getContentList(filters?: ContentFilters): Promise<APIResponse<ContentItem[]>>;
  getContentById(contentId: string): Promise<APIResponse<ContentItem>>;
  createContent(content: Omit<ContentItem, 'id'>): Promise<APIResponse<ContentItem>>;
  updateContent(contentId: string, updates: Partial<ContentItem>): Promise<APIResponse<ContentItem>>;
  deleteContent(contentId: string): Promise<APIResponse<void>>;
  getRecommendedContent(userId: string, limit?: number): Promise<APIResponse<ContentItem[]>>;
}

export interface ContentFilters {
  category?: string;
  ageRange?: [number, number];
  growthStage?: string;
  tags?: string[];
  searchQuery?: string;
}

export class ContentService implements ContentAPI {
  private client: APIClient;
  
  constructor(baseURL: string) {
    this.client = new APIClient(baseURL);
  }
  
  async getContentList(filters?: ContentFilters): Promise<APIResponse<ContentItem[]>> {
    return this.client.get<ContentItem[]>('/api/contents', filters);
  }
  
  async getContentById(contentId: string): Promise<APIResponse<ContentItem>> {
    return this.client.get<ContentItem>(`/api/contents/${contentId}`);
  }
  
  async createContent(content: Omit<ContentItem, 'id'>): Promise<APIResponse<ContentItem>> {
    return this.client.post<ContentItem>('/api/contents', content);
  }
  
  async updateContent(contentId: string, updates: Partial<ContentItem>): Promise<APIResponse<ContentItem>> {
    return this.client.put<ContentItem>(`/api/contents/${contentId}`, updates);
  }
  
  async deleteContent(contentId: string): Promise<APIResponse<void>> {
    return this.client.delete<void>(`/api/contents/${contentId}`);
  }
  
  async getRecommendedContent(userId: string, limit: number = 10): Promise<APIResponse<ContentItem[]>> {
    return this.client.get<ContentItem[]>(`/api/users/${userId}/recommended-contents`, { limit });
  }
}6.4 AI服务API
6.4.1 AI交互接口
export interface AIAPI {
  sendMessage(message: string, context?: AIContext): Promise<APIResponse<AIMessage>>;
  startVoiceRecognition(): Promise<APIResponse<string>>;
  stopVoiceRecognition(): Promise<APIResponse<void>>;
  textToSpeech(text: string, voice?: string): Promise<APIResponse<string>>;
  getRecommendations(userId: string, context?: AIContext): Promise<APIResponse<AIRecommendation[]>>;
  analyzeIntent(message: string): Promise<APIResponse<AIIntent>>;
}

export interface AIContext {
  userId: string;
  currentContent?: string;
  growthStage?: string;
  recentTopics?: string[];
  userPreferences?: Record<string, any>;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AIRecommendation {
  id: string;
  type: 'content' | 'action' | 'question';
  title: string;
  description: string;
  relevanceScore: number;
  data?: any;
}

export interface AIIntent {
  intent: string;
  confidence: number;
  entities: Record<string, any>;
  suggestions: string[];
}

export class AIService implements AIAPI {
  private client: APIClient;
  
  constructor(baseURL: string) {
    this.client = new APIClient(baseURL);
  }
  
  async sendMessage(message: string, context?: AIContext): Promise<APIResponse<AIMessage>> {
    return this.client.post<AIMessage>('/api/ai/message', { message, context });
  }
  
  async startVoiceRecognition(): Promise<APIResponse<string>> {
    return this.client.post<string>('/api/ai/voice/start');
  }
  
  async stopVoiceRecognition(): Promise<APIResponse<void>> {
    return this.client.post<void>('/api/ai/voice/stop');
  }
  
  async textToSpeech(text: string, voice?: string): Promise<APIResponse<string>> {
    return this.client.post<string>('/api/ai/tts', { text, voice });
  }
  
  async getRecommendations(userId: string, context?: AIContext): Promise<APIResponse<AIRecommendation[]>> {
    return this.client.get<AIRecommendation[]>(`/api/ai/recommendations/${userId}`, context);
  }
  
  async analyzeIntent(message: string): Promise<APIResponse<AIIntent>> {
    return this.client.post<AIIntent>('/api/ai/intent', { message });
  }
}---
七、用户信息及全局形象系统
7.1 用户画像系统
7.1.1 用户画像数据结构
export interface UserPersona {
  id: string;
  basicInfo: UserBasicInfo;
  growthInfo: UserGrowthInfo;
  preferences: UserPreferences;
  behaviorData: UserBehaviorData;
  achievements: UserAchievement[];
  socialData: UserSocialData;
  lastUpdated: string;
}

export interface UserBasicInfo {
  userId: string;
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  location?: string;
  timezone?: string;
  language: string;
}

export interface UserGrowthInfo {
  currentStage: string;
  stageProgress: number;
  completedStages: string[];
  growthRecords: GrowthRecord[];
  learningGoals: LearningGoal[];
  skillLevels: SkillLevel[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

export interface SkillLevel {
  skill: string;
  level: number;
  lastAssessed: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationSettings: NotificationSettings;
  contentPreferences: ContentPreferences;
  interactionPreferences: InteractionPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface ContentPreferences {
  favoriteCategories: string[];
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  contentTypes: string[];
  culturalInterests: string[];
}

export interface InteractionPreferences {
  voiceEnabled: boolean;
  autoPlay: boolean;
  textSize: 'small' | 'medium' | 'large';
  animationEnabled: boolean;
}

export interface UserBehaviorData {
  sessionHistory: SessionRecord[];
  contentInteractions: ContentInteraction[];
  searchHistory: SearchRecord[];
  clickHeatmap: HeatmapData;
}

export interface SessionRecord {
  sessionId: string;
  startTime: number;
  endTime: number;
  duration: number;
  pagesVisited: string[];
  actions: ActionRecord[];
}

export interface ActionRecord {
  type: string;
  target: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ContentInteraction {
  contentId: string;
  interactionType: 'view' | 'like' | 'share' | 'comment' | 'complete';
  timestamp: number;
  duration?: number;
  rating?: number;
}

export interface SearchRecord {
  query: string;
  timestamp: number;
  resultsClicked: string[];
}

export interface HeatmapData {
  clicks: { x: number; y: number; count: number }[];
  scrolls: { depth: number; count: number }[];
  dwellTime: { element: string; time: number }[];
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  target?: number;
}

export interface UserSocialData {
  friends: string[];
  groups: string[];
  sharedContent: string[];
  receivedLikes: number;
  givenLikes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  contentId: string;
  text: string;
  timestamp: number;
  likes: number;
}7.1.2 用户画像管理
export class UserPersonaManager {
  private persona: UserPersona | null = null;
  private storageKey = 'user_persona';
  
  async loadPersona(userId: string): Promise<UserPersona> {
    const cached = localStorage.getItem(this.storageKey);
    if (cached) {
      this.persona = JSON.parse(cached);
      return this.persona;
    }
    
    const response = await fetch(`/api/users/${userId}/persona`);
    const data = await response.json();
    
    this.persona = data;
    this.savePersona();
    
    return this.persona;
  }
  
  updatePersona(updates: Partial<UserPersona>): void {
    if (!this.persona) return;
    
    this.persona = {
      ...this.persona,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    
    this.savePersona();
  }
  
  updateBasicInfo(updates: Partial<UserBasicInfo>): void {
    if (!this.persona) return;
    
    this.persona.basicInfo = {
      ...this.persona.basicInfo,
      ...updates,
    };
    
    this.savePersona();
  }
  
  updatePreferences(updates: Partial<UserPreferences>): void {
    if (!this.persona) return;
    
    this.persona.preferences = {
      ...this.persona.preferences,
      ...updates,
    };
    
    this.savePersona();
  }
  
  addAchievement(achievement: UserAchievement): void {
    if (!this.persona) return;
    
    this.persona.achievements.push(achievement);
    this.savePersona();
  }
  
  recordBehavior(action: ActionRecord): void {
    if (!this.persona) return;
    
    const currentSession = this.persona.behaviorData.sessionHistory[0];
    if (currentSession) {
      currentSession.actions.push(action);
    }
    
    this.savePersona();
  }
  
  recordContentInteraction(interaction: ContentInteraction): void {
    if (!this.persona) return;
    
    this.persona.behaviorData.contentInteractions.push(interaction);
    this.savePersona();
  }
  
  getPersona(): UserPersona | null {
    return this.persona;
  }
  
  private savePersona(): void {
    if (this.persona) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.persona));
    }
  }
}7.2 全局形象系统
7.2.1 形象数据结构
export interface GlobalAvatar {
  id: string;
  userId: string;
  name: string;
  type: 'character' | 'animal' | 'object' | 'abstract';
  baseAppearance: AvatarAppearance;
  customization: AvatarCustomization;
  accessories: AvatarAccessory[];
  animations: AvatarAnimation[];
  expressions: AvatarExpression[];
  voiceProfile: VoiceProfile;
  personality: AvatarPersonality;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarAppearance {
  bodyType: 'slim' | 'normal' | 'chubby';
  skinColor: string;
  eyeColor: string;
  hairColor: string;
  hairStyle: string;
  height: number;
  weight: number;
}

export interface AvatarCustomization {
  clothing: ClothingItem[];
  accessories: AccessoryItem[];
  colors: ColorScheme;
  patterns: Pattern[];
}

export interface ClothingItem {
  id: string;
  type: 'top' | 'bottom' | 'shoes' | 'hat' | 'accessory';
  name: string;
  style: string;
  color: string;
  icon: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  position: { x: number; y: number };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface Pattern {
  id: string;
  name: string;
  type: string;
  icon: string;
}

export interface AvatarAccessory {
  id: string;
  name: string;
  type: string;
  icon: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export interface AvatarAnimation {
  id: string;
  name: string;
  type: 'idle' | 'walking' | 'running' | 'jumping' | 'dancing' | 'talking';
  duration: number;
  frames: AnimationFrame[];
}

export interface AnimationFrame {
  timestamp: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
}

export interface AvatarExpression {
  id: string;
  name: string;
  type: 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral' | 'excited';
  icon: string;
  facialFeatures: FacialFeatures;
}

export interface FacialFeatures {
  eyes: { open: number; shape: string };
  eyebrows: { position: number; angle: number };
  mouth: { open: number; shape: string };
  cheeks: { blush: boolean; intensity: number };
}

export interface VoiceProfile {
  id: string;
  name: string;
  type: 'male' | 'female' | 'child' | 'robot';
  pitch: number;
  speed: number;
  volume: number;
  accent?: string;
}

export interface AvatarPersonality {
  traits: PersonalityTrait[];
  mood: string;
  energyLevel: number;
  friendliness: number;
  curiosity: number;
}

export interface PersonalityTrait {
  name: string;
  value: number;
  description: string;
}7.2.2 形象管理
export class AvatarManager {
  private avatar: GlobalAvatar | null = null;
  private storageKey = 'global_avatar';
  
  async loadAvatar(userId: string): Promise<GlobalAvatar> {
    const cached = localStorage.getItem(this.storageKey);
    if (cached) {
      this.avatar = JSON.parse(cached);
      return this.avatar;
    }
    
    const response = await fetch(`/api/users/${userId}/avatar`);
    const data = await response.json();
    
    this.avatar = data;
    this.saveAvatar();
    
    return this.avatar;
  }
  
  createAvatar(avatarData: Omit<GlobalAvatar, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): GlobalAvatar {
    this.avatar = {
      ...avatarData,
      id: uuidv4(),
      userId: avatarData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.saveAvatar();
    return this.avatar;
  }
  
  updateAppearance(appearance: Partial<AvatarAppearance>): void {
    if (!this.avatar) return;
    
    this.avatar.baseAppearance = {
      ...this.avatar.baseAppearance,
      ...appearance,
    };
    this.avatar.updatedAt = new Date().toISOString();
    
    this.saveAvatar();
  }
  
  updateCustomization(customization: Partial<AvatarCustomization>): void {
    if (!this.avatar) return;
    
    this.avatar.customization = {
      ...this.avatar.customization,
      ...customization,
    };
    this.avatar.updatedAt = new Date().toISOString();
    
    this.saveAvatar();
  }
  
  addAccessory(accessory: AvatarAccessory): void {
    if (!this.avatar) return;
    
    this.avatar.accessories.push(accessory);
    this.avatar.updatedAt = new Date().toISOString();
    
    this.saveAvatar();
  }
  
  removeAccessory(accessoryId: string): void {
    if (!this.avatar) return;
    
    this.avatar.accessories = this.avatar.accessories.filter(a => a.id !== accessoryId);
    this.avatar.updatedAt = new Date().toISOString();
    
    this.saveAvatar();
  }
  
  updateVoiceProfile(voiceProfile: Partial<VoiceProfile>): void {
    if (!this.avatar) return;
    
    this.avatar.voiceProfile = {
      ...this.avatar.voiceProfile,
      ...voiceProfile,
    };
    this.avatar.updatedAt = new Date().toISOString();
    
    this.saveAvatar();
  }
  
  updatePersonality(personality: Partial<AvatarPersonality>): void {
    if (!this.avatar) return;
    
    this.avatar.personality = {
      ...this.avatar.personality,
      ...personality,
    };
    this.avatar.updatedAt = new Date().toISOString();
    
    this.saveAvatar();
  }
  
  setExpression(expressionId: string): void {
    if (!this.avatar) return;
    
    const expression = this.avatar.expressions.find(e => e.id === expressionId);
    if (expression) {
      this.avatar.personality.mood = expression.type;
      this.saveAvatar();
    }
  }
  
  getAvatar(): GlobalAvatar | null {
    return this.avatar;
  }
  
  private saveAvatar(): void {
    if (this.avatar) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.avatar));
    }
  }
}---
八、信息映射系统
8.1 内容映射引擎
8.1.1 映射规则引擎
export interface MappingRule {
  id: string;
  name: string;
  description: string;
  sourceType: 'age' | 'growth_stage' | 'interest' | 'behavior' | 'time';
  targetType: 'content' | 'activity' | 'recommendation';
  conditions: MappingCondition[];
  actions: MappingAction[];
  priority: number;
  enabled: boolean;
}

export interface MappingCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface MappingAction {
  type: 'filter' | 'sort' | 'boost' | 'hide' | 'transform';
  target: string;
  parameters?: Record<string, any>;
}

export class MappingRuleEngine {
  private rules: Map<string, MappingRule> = new Map();
  
  registerRule(rule: MappingRule): void {
    this.rules.set(rule.id, rule);
  }
  
  unregisterRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }
  
  applyRules(context: MappingContext): MappingResult {
    const enabledRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority);
    
    const result: MappingResult = {
      matchedRules: [],
      actions: [],
      transformedContext: { ...context },
    };
    
    for (const rule of enabledRules) {
      if (this.evaluateConditions(rule.conditions, context)) {
        result.matchedRules.push(rule.id);
        result.actions.push(...rule.actions);
        result.transformedContext = this.applyActions(
          rule.actions,
          result.transformedContext
        );
      }
    }
    
    return result;
  }
  
  private evaluateConditions(conditions: MappingCondition[], context: MappingContext): boolean {
    return conditions.every(condition => {
      const value = this.getFieldValue(condition.field, context);
      return this.compareValues(value, condition.operator, condition.value);
    });
  }
  
  private getFieldValue(field: string, context: MappingContext): any {
    return field.split('.').reduce((obj, key) => obj?.[key], context);
  }
  
  private compareValues(value1: any, operator: string, value2: any): boolean {
    switch (operator) {
      case 'eq': return value1 === value2;
      case 'neq': return value1 !== value2;
      case 'gt': return value1 > value2;
      case 'lt': return value1 < value2;
      case 'gte': return value1 >= value2;
      case 'lte': return value1 <= value2;
      case 'in': return Array.isArray(value2) && value2.includes(value1);
      case 'contains': return String(value1).includes(String(value2));
      default: return false;
    }
  }
  
  private applyActions(actions: MappingAction[], context: MappingContext): MappingContext {
    let result = { ...context };
    
    for (const action of actions) {
      switch (action.type) {
        case 'filter':
          result = this.applyFilter(result, action);
          break;
        case 'sort':
          result = this.applySort(result, action);
          break;
        case 'boost':
          result = this.applyBoost(result, action);
          break;
        case 'hide':
          result = this.applyHide(result, action);
          break;
        case 'transform':
          result = this.applyTransform(result, action);
          break;
      }
    }
    
    return result;
  }
  
  private applyFilter(context: MappingContext, action: MappingAction): MappingContext {
    return context;
  }
  
  private applySort(context: MappingContext, action: MappingAction): MappingContext {
    return context;
  }
  
  private applyBoost(context: MappingContext, action: MappingAction): MappingContext {
    return context;
  }
  
  private applyHide(context: MappingContext, action: MappingAction): MappingContext {
    return context;
  }
  
  private applyTransform(context: MappingContext, action: MappingAction): MappingContext {
    return context;
  }
}

export interface MappingContext {
  userId: string;
  age: number;
  growthStage: string;
  interests: string[];
  behavior: UserBehaviorData;
  timeContext: TimeContext;
  content?: ContentItem[];
}

export interface TimeContext {
  currentHour: number;
  dayOfWeek: number;
  season: string;
  holiday?: string;
}

export interface MappingResult {
  matchedRules: string[];
  actions: MappingAction[];
  transformedContext: MappingContext;
}8.1.2 年龄适配映射
export const ageMappingRules: MappingRule[] = [
  {
    id: 'age_3_6_content',
    name: '3-6岁内容适配',
    description: '为3-6岁儿童推荐适合的内容',
    sourceType: 'age',
    targetType: 'content',
    conditions: [
      { field: 'age', operator: 'gte', value: 3 },
      { field: 'age', operator: 'lte', value: 6 },
    ],
    actions: [
      {
        type: 'filter',
        target: 'content',
        parameters: {
          minAge: 3,
          maxAge: 6,
          difficulty: 'easy',
        },
      },
      {
        type: 'boost',
        target: 'content',
        parameters: {
          categories: ['故事', '儿歌', '游戏'],
          boostFactor: 2.0,
        },
      },
    ],
    priority: 10,
    enabled: true,
  },
  {
    id: 'age_7_12_content',
    name: '7-12岁内容适配',
    description: '为7-12岁儿童推荐适合的内容',
    sourceType: 'age',
    targetType: 'content',
    conditions: [
      { field: 'age', operator: 'gte', value: 7 },
      { field: 'age', operator: 'lte', value: 12 },
    ],
    actions: [
      {
        type: 'filter',
        target: 'content',
        parameters: {
          minAge: 7,
          maxAge: 12,
          difficulty: 'medium',
        },
      },
      {
        type: 'boost',
        target: 'content',
        parameters: {
          categories: ['科普', '文化', '历史'],
          boostFactor: 1.5,
        },
      },
    ],
    priority: 10,
    enabled: true,
  },
];8.2 文化融合映射
8.2.1 洛阳文化元素映射
export interface CultureElement {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  audio?: string;
  video?: string;
  relatedContent: string[];
  ageRanges: [number, number][];
  tags: string[];
}

export const luoyangCultureElements: CultureElement[] = [
  {
    id: 'longmen_grottoes',
    name: '龙门石窟',
    category: '历史遗迹',
    description: '龙门石窟是中国四大石窟之一，始建于北魏时期，拥有丰富的佛教艺术珍品。',
    images: ['longmen_1.jpg', 'longmen_2.jpg', 'longmen_3.jpg'],
    relatedContent: ['佛教艺术', '北魏历史', '石刻艺术'],
    ageRanges: [[7, 12], [13, 18]],
    tags: ['历史', '艺术', '佛教', '世界遗产'],
  },
  {
    id: 'white_horse_temple',
    name: '白马寺',
    category: '宗教建筑',
    description: '白马寺是中国第一座官办佛教寺院，被誉为"中国佛教的祖庭"。',
    images: ['baimasi_1.jpg', 'baimasi_2.jpg'],
    relatedContent: ['佛教传入', '寺院建筑', '佛教文化'],
    ageRanges: [[7, 12], [13, 18]],
    tags: ['宗教', '历史', '建筑', '佛教'],
  },
  {
    id: 'peony_festival',
    name: '牡丹花会',
    category: '民俗活动',
    description: '洛阳牡丹花会是每年春季举办的大型文化活动，展示各种名贵牡丹品种。',
    images: ['peony_1.jpg', 'peony_2.jpg', 'peony_3.jpg'],
    audio: 'peony_introduction.mp3',
    relatedContent: ['花卉知识', '春季习俗', '洛阳文化'],
    ageRanges: [[3, 6], [7, 12], [13, 18]],
    tags: ['花卉', '民俗', '春季', '文化'],
  },
];

export class CultureMappingEngine {
  private elements: Map<string, CultureElement> = new Map();
  
  constructor(elements: CultureElement[]) {
    elements.forEach(element => {
      this.elements.set(element.id, element);
    });
  }
  
  getElementsByCategory(category: string): CultureElement[] {
    return Array.from(this.elements.values()).filter(
      element => element.category === category
    );
  }
  
  getElementsByAge(age: number): CultureElement[] {
    return Array.from(this.elements.values()).filter(element =>
      element.ageRanges.some(([min, max]) => age >= min && age <= max)
    );
  }
  
  getElementsByTags(tags: string[]): CultureElement[] {
    return Array.from(this.elements.values()).filter(element =>
      tags.some(tag => element.tags.includes(tag))
    );
  }
  
  searchElements(query: string): CultureElement[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.elements.values()).filter(element =>
      element.name.toLowerCase().includes(lowerQuery) ||
      element.description.toLowerCase().includes(lowerQuery) ||
      element.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  getRelatedContent(elementId: string): string[] {
    const element = this.elements.get(elementId);
    return element?.relatedContent || [];
  }
  
  getRecommendedElements(userId: string, userPersona: UserPersona): CultureElement[] {
    const age = userPersona.basicInfo.age;
    const interests = userPersona.preferences.contentPreferences.culturalInterests;
    
    let elements = this.getElementsByAge(age);
    
    if (interests.length > 0) {
      const interestElements = this.getElementsByTags(interests);
      elements = [...new Set([...elements, ...interestElements])];
    }
    
    return elements;
  }
}---
九、技术实现规范
9.1 代码规范
9.1.1 TypeScript规范
export const TypeScriptRules = {
  命名规范: {
    接口: '使用PascalCase，以I开头（可选）',
    类型: '使用PascalCase',
    类: '使用PascalCase',
    函数: '使用camelCase',
    变量: '使用camelCase',
    常量: '使用UPPER_SNAKE_CASE',
    私有成员: '使用下划线前缀',
  },
  
  类型定义: {
    优先使用接口: '对于对象类型，优先使用interface',
    类型别名: '用于联合类型、交叉类型等',
    泛型: '使用T、U、V等单字母或描述性名称',
    可选属性: '使用?标记',
    只读属性: '使用readonly标记',
  },
  
  注释规范: {
    文件注释: '每个文件顶部添加文件说明',
    函数注释: '使用JSDoc格式',
    复杂逻辑: '添加详细注释说明',
    TODO: '使用// TODO: 标记待办事项',
  },
  
  代码组织: {
    导入顺序: '第三方库 -> 内部模块 -> 类型导入',
    导出: '使用命名导出，避免默认导出',
    文件大小: '单个文件不超过500行',
    函数长度: '单个函数不超过50行',
  },
};9.1.2 React组件规范
export const ReactComponentRules = {
  组件定义: {
    函数组件: '优先使用函数组件',
    Hooks: '合理使用Hooks，避免过度使用',
    Props: '使用interface定义Props类型',
    默认Props: '使用参数默认值代替defaultProps',
  },
  
  状态管理: {
    本地状态: '使用useState',
    复杂状态: '使用useReducer',
    全局状态: '使用Redux或Context',
    副作用: '使用useEffect',
  },
  
  性能优化: {
    记忆化: '使用useMemo缓存计算结果',
    回调: '使用useCallback缓存函数',
    列表渲染: '使用key属性',
    懒加载: '使用React.lazy和Suspense',
  },
  
  样式处理: {
    CSS模块: '使用CSS Modules或styled-components',
    Tailwind: '使用Tailwind CSS工具类',
    响应式: '使用媒体查询或响应式组件',
  },
};9.2 性能优化规范
9.2.1 加载性能
export const PerformanceRules = {
  资源加载: {
    图片优化: '使用WebP格式，设置懒加载',
    代码分割: '使用动态import进行代码分割',
    预加载: '对关键资源使用preload',
    CDN: '使用CDN加速静态资源',
  },
  
  渲染性能: {
    虚拟列表: '长列表使用虚拟滚动',
    防抖节流: '使用防抖和节流优化频繁操作',
    避免重渲染: '使用React.memo避免不必要的渲染',
    批量更新: '使用批量更新减少渲染次数',
  },
  
  网络性能: {
    请求合并: '合并多个请求',
    缓存策略: '使用HTTP缓存和本地缓存',
    数据压缩: '启用gzip压缩',
    WebSocket: '实时数据使用WebSocket',
  },
  
  监控指标: {
    FCP: '首次内容绘制时间 < 1.8s',
    LCP: '最大内容绘制时间 < 2.5s',
    FID: '首次输入延迟 < 100ms',
    CLS: '累积布局偏移 < 0.1',
  },
};---
十、设计规范与标准
10.1 视觉设计规范
10.1.1 色彩系统
export const ColorSystem = {
  主色调: {
    primary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    secondary: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
  },
  
  中性色: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  
  语义色: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  渐变色: {
    primary: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    background: 'linear-gradient(180deg, #F5F3FF 0%, #FDF2F8 100%)',
  },
};10.1.2 字体系统
export const TypographySystem = {
  字体家族: {
    primary: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    secondary: '"Georgia", "Times New Roman", serif',
    monospace: '"Menlo", "Monaco", "Courier New", monospace',
  },
  
  字号: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  
  字重: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  行高: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  字间距: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};10.1.3 间距系统
export const SpacingSystem = {
  间距单位: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  
  容器宽度: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  圆角: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  阴影: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};10.2 交互设计规范
10.2.1 动画规范
export const AnimationSystem = {
  时长: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  缓动函数: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  动画类型: {
    fade: 'opacity',
    slide: 'transform',
    scale: 'transform',
    rotate: 'transform',
  },
  
  过渡效果: {
    default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};10.2.2 手势规范
export const GestureSystem = {
  点击: {
    最小点击区域: '44px × 44px',
    点击反馈: '100ms内显示反馈',
    双击: '间隔 < 300ms',
  },
  
  滑动: {
    最小滑动距离: '10px',
    滑动速度阈值: '0.3px/ms',
    滑动方向: '水平、垂直、对角',
  },
  
  缩放: {
    最小缩放比例: '0.5',
    最大缩放比例: '3.0',
    缩放中心: '双指中心点',
  },
  
  长按: {
    最小长按时长: '500ms',
    长按反馈: '震动或视觉反馈',
    长按动作: '显示上下文菜单',
  },
};10.3 可访问性规范
10.3.1 WCAG标准
export const AccessibilityRules = {
  感知性: {
    文本替代: '所有非文本内容提供替代文本',
    音频控制: '提供播放控制',
    视频字幕: '提供字幕和手语',
    对比度: '文本对比度至少4.5:1',
  },
  
  可操作性: {
    键盘访问: '所有功能可通过键盘访问',
    焦点管理: '清晰的焦点指示',
    时间限制: '提供关闭或延长时间限制的选项',
    闪烁内容: '避免超过3次/秒的闪烁',
  },
  
  可理解性: {
    语言声明: '明确声明页面语言',
    错误提示: '清晰的错误说明和建议',
    一致性: '一致的导航和标识',
    帮助文档: '提供帮助和说明',
  },
  
  健壮性: {
    HTML标准: '使用标准HTML元素',
    ARIA: '正确使用ARIA属性',
    兼容性: '与辅助技术兼容',
  },
};---
附录
A. 组件索引
组件名称
文件路径
说明

Button
/components/foundation/Button.tsx
基础按钮组件

Card
/components/foundation/Card.tsx
卡片组件

Input
/components/foundation/Input.tsx
输入框组件

LoadingSpinner
/components/foundation/LoadingSpinner.tsx
加载器组件

Toast
/components/foundation/Toast.tsx
提示框组件

GrowthCard
/components/business/GrowthCard.tsx
成长卡片组件

CultureCarousel
/components/business/CultureCarousel.tsx
文化轮播组件

AIFloatingWindow
/components/system/AIFloatingWindow.tsx
AI浮窗组件

B. API端点索引
端点
方法
说明

/api/users/{userId}
GET
获取用户信息

/api/users/{userId}
PUT
更新用户信息

/api/users/{userId}/growth-records
GET
获取成长记录

/api/contents
GET
获取内容列表

/api/contents/{contentId}
GET
获取内容详情

/api/ai/message
POST
发送AI消息

/api/ai/voice/start
POST
开始语音识别

/api/ai/voice/stop
POST
停止语音识别

C. 参考文档
• Next.js 14文档
• React 18文档
• TypeScript文档
• Tailwind CSS文档
• Redux Toolkit文档
• WCAG 2.1指南
---
文档结束
「YanYuCloudCube」
「admin@0379.email」
「Words Initiate Quadrants, Language Serves as Core for the Future」
「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」