---
@file: 01-YYC3-XY-组件开发规范.md
@description: YYC3-XY项目React组件开发规范,包括命名、结构、文档等标准
@author: YYC³
@version: v1.0.0
@created: 2025-12-28
@updated: 2025-12-28
@status: published
@tags: 组件开发,代码规范,React,TypeScript
---

# YYC³-XY 组件开发规范

> **YanYuCloudCube**
> **标语**:言启象限 | 语枢未来
> ***Words Initiate Quadrants, Language Serves as Core for the Future***

---

## 📋 目录

1. [组件分类](#一组件分类)
2. [命名规范](#二命名规范)
3. [文件组织](#三文件组织)
4. [组件结构](#四组件结构)
5. [Props设计](#五props设计)
6. [样式规范](#六样式规范)
7. [文档规范](#七文档规范)
8. [测试规范](#八测试规范)
9. [性能优化](#九性能优化)
10. [最佳实践](#十最佳实践)

---

## 一、组件分类

### 1.1 基础组件 (Base Components)

**定义**: 最小粒度的UI组件,无业务逻辑

**示例**: Button, Input, Card, Badge, Avatar

**特点**:
- 高度可复用
- 纯展示型
- Props简单明确
- 无状态或简单状态

**目录**: `/components/ui/`

### 1.2 布局组件 (Layout Components)

**定义**: 负责页面布局和结构的组件

**示例**: Header, Footer, Sidebar, Container, Grid

**特点**:
- 控制页面结构
- 响应式设计
- 子组件插槽
- 适配多种设备

**目录**: `/components/layout/`

### 1.3 业务组件 (Business Components)

**定义**: 包含业务逻辑的功能组件

**示例**: UserProfile, GrowthCard, CourseList, HomeworkPanel

**特点**:
- 特定业务场景
- 包含数据获取
- 状态管理
- 事件处理

**目录**: `/components/features/`

### 1.4 页面组件 (Page Components)

**定义**: 完整页面级别的组件

**示例**: HomePage, DashboardPage, ProfilePage

**特点**:
- 路由对应
- 组合多个组件
- 页面级状态
- SEO优化

**目录**: `/app/*/page.tsx`

### 1.5 系统组件 (System Components)

**定义**: 全局系统级功能组件

**示例**: AIFloating, ThemeProvider, ErrorBoundary, AuthGuard

**特点**:
- 全局可用
- 独立运行
- 跨页面使用
- 高优先级

**目录**: `/components/system/`

---

## 二、命名规范

### 2.1 组件命名

**规则**: PascalCase (大驼峰命名)

```typescript
// ✅ 正确
Button
UserProfile
GrowthRecordCard
AIFloatingWindow

// ❌ 错误
button
user_profile
growth-record-card
aiFloatingWindow
```

**命名原则**:
- 语义化,见名知意
- 使用完整单词,避免缩写
- 多个单词用驼峰连接
- 前缀或后缀表示类型

### 2.2 文件命名

**规则**: 与组件名一致,PascalCase.tsx

```
Button.tsx
UserProfile.tsx
GrowthRecordCard.tsx
AIFloatingWindow.tsx
```

**关联文件**:
```
Button/
├── Button.tsx           # 组件实现
├── Button.test.tsx      # 单元测试
├── Button.stories.tsx   # Storybook故事
├── Button.module.css    # 样式文件
└── index.ts             # 导出文件
```

### 2.3 Props命名

**接口命名**: 组件名 + Props

```typescript
interface ButtonProps {
  // ...
}

interface UserProfileProps {
  // ...
}
```

**属性命名**:
```typescript
interface ButtonProps {
  // 基础属性: camelCase
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  
  // 布尔属性: is/has/can前缀
  isDisabled?: boolean
  hasIcon?: boolean
  canSubmit?: boolean
  
  // 事件处理: on前缀
  onClick?: () => void
  onHover?: () => void
  onChange?: (value: string) => void
  
  // 子元素
  children?: React.ReactNode
  
  // 样式相关
  className?: string
  style?: React.CSSProperties
}
```

### 2.4 Hook命名

**规则**: use + 功能描述

```typescript
// ✅ 正确
useAuth()
useUserProfile()
useGrowthRecords()
useAIAssistant()

// ❌ 错误
getAuth()
userProfile()
growthRecords()
aiAssistant()
```

---

## 三、文件组织

### 3.1 组件目录结构

```
components/
├── ui/                      # 基础UI组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   └── Card/
│
├── layout/                  # 布局组件
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
│
├── features/                # 业务组件
│   ├── user/
│   │   ├── UserProfile/
│   │   └── UserSettings/
│   ├── growth/
│   │   ├── GrowthCard/
│   │   └── GrowthChart/
│   └── ai/
│       ├── AIChat/
│       └── AIVoice/
│
└── system/                  # 系统组件
    ├── AIFloating/
    ├── ThemeProvider/
    └── ErrorBoundary/
```

### 3.2 组件文件内容

**最小单位组件**:
```typescript
// Button.tsx
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

**完整组件目录**:
```typescript
// index.ts
export { Button } from './Button'
export type { ButtonProps } from './Button'
export { default } from './Button'
```

---

## 四、组件结构

### 4.1 标准组件模板

```typescript
/**
 * @component Button
 * @description 通用按钮组件,支持多种样式和尺寸
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   点击我
 * </Button>
 * ```
 */

import { FC, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// ========================================
// 类型定义
// ========================================

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** 按钮样式变体 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg'
  
  /** 是否禁用 */
  isDisabled?: boolean
  
  /** 是否显示加载状态 */
  isLoading?: boolean
  
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
  
  /** 点击事件处理 */
  onClick?: () => void
  
  /** 子元素 */
  children: React.ReactNode
  
  /** 自定义类名 */
  className?: string
}

// ========================================
// 组件实现
// ========================================

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  isLoading = false,
  type = 'button',
  onClick,
  children,
  className,
  ...rest
}) => {
  // ========================================
  // 状态管理
  // ========================================
  
  // (如需要)
  
  // ========================================
  // 副作用
  // ========================================
  
  // (如需要)
  
  // ========================================
  // 事件处理
  // ========================================
  
  const handleClick = () => {
    if (isDisabled || isLoading) return
    onClick?.()
  }
  
  // ========================================
  // 样式计算
  // ========================================
  
  const buttonClasses = cn(
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    
    // 变体样式
    {
      'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
      'bg-secondary-500 text-white hover:bg-secondary-600': variant === 'secondary',
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50': variant === 'outline',
      'text-gray-700 hover:bg-gray-100': variant === 'ghost',
    },
    
    // 尺寸样式
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    },
    
    // 状态样式
    {
      'opacity-50 cursor-not-allowed': isDisabled,
      'cursor-wait': isLoading,
    },
    
    className
  )
  
  // ========================================
  // 渲染
  // ========================================
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      {...rest}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
```

### 4.2 组件结构顺序

1. **文件头注释** - 组件说明和使用示例
2. **导入语句** - 按类型分组
3. **类型定义** - Interface/Type定义
4. **常量定义** - 组件内常量
5. **组件实现** - 函数组件
   - Props解构
   - 状态管理
   - 副作用(useEffect)
   - 计算值(useMemo)
   - 回调函数(useCallback)
   - 事件处理
   - 渲染
6. **导出语句** - 默认导出和命名导出

---

## 五、Props设计

### 5.1 Props设计原则

**1. 单一职责**
```typescript
// ✅ 好的设计
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

// ❌ 不好的设计
interface ButtonProps {
  onClick: () => void
  onHover: () => void
  onFocus: () => void
  onBlur: () => void
  // 职责太多
}
```

**2. 最小化原则**
```typescript
// ✅ 好的设计
interface CardProps {
  title: string
  children: React.ReactNode
}

// ❌ 不好的设计
interface CardProps {
  title: string
  subtitle?: string
  headerIcon?: React.ReactNode
  headerActions?: React.ReactNode
  bodyPadding?: string
  footerContent?: React.ReactNode
  // Props过多,考虑拆分组件
}
```

**3. 类型安全**
```typescript
// ✅ 好的设计
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  size: 'sm' | 'md' | 'lg'
}

// ❌ 不好的设计
interface ButtonProps {
  variant: string
  size: string
}
```

### 5.2 Props命名约定

```typescript
interface ComponentProps {
  // 数据属性
  data: DataType
  items: ItemType[]
  user: User
  
  // 配置属性
  config?: ConfigType
  options?: OptionsType
  
  // 布尔属性(is/has/can前缀)
  isVisible?: boolean
  hasError?: boolean
  canEdit?: boolean
  
  // 回调属性(on前缀)
  onClick?: () => void
  onChange?: (value: string) => void
  onSubmit?: (data: FormData) => void
  
  // 渲染属性(render前缀或以Element结尾)
  renderHeader?: () => React.ReactNode
  customElement?: React.ReactNode
  
  // 样式属性
  className?: string
  style?: React.CSSProperties
  
  // 子元素
  children?: React.ReactNode
}
```

### 5.3 可选Props默认值

```typescript
// 方式1: 参数解构时赋默认值
export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  ...rest
}) => {
  // ...
}

// 方式2: 使用defaultProps(不推荐)
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  isDisabled: false,
}
```

---

## 六、样式规范

### 6.1 Tailwind CSS优先

```typescript
// ✅ 推荐: 使用Tailwind类名
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">标题</h2>
  <button className="px-4 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600">
    按钮
  </button>
</div>

// ❌ 不推荐: 内联样式
<div style={{ display: 'flex', padding: '16px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>标题</h2>
</div>
```

### 6.2 条件类名

```typescript
import { cn } from '@/lib/utils'

// 使用cn工具函数
<button
  className={cn(
    'px-4 py-2 rounded-md',
    variant === 'primary' && 'bg-blue-500 text-white',
    variant === 'secondary' && 'bg-gray-500 text-white',
    isDisabled && 'opacity-50 cursor-not-allowed',
    className
  )}
>
  按钮
</button>
```

### 6.3 样式模块化

```typescript
// Button.module.css
.button {
  @apply inline-flex items-center justify-center;
  @apply font-medium rounded-lg;
  @apply transition-colors duration-200;
}

.primary {
  @apply bg-primary-500 text-white;
  @apply hover:bg-primary-600;
}

.secondary {
  @apply bg-secondary-500 text-white;
  @apply hover:bg-secondary-600;
}

// Button.tsx
import styles from './Button.module.css'

<button className={`${styles.button} ${styles.primary}`}>
  按钮
</button>
```

### 6.4 响应式设计

```typescript
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4 
  md:p-6 
  lg:p-8
">
  {/* 内容 */}
</div>
```

---

## 七、文档规范

### 7.1 JSDoc注释

```typescript
/**
 * 通用按钮组件
 * 
 * @component
 * @description 
 * 提供多种样式变体和尺寸的按钮组件,支持加载状态和禁用状态
 * 
 * @param {ButtonProps} props - 组件属性
 * @param {string} [props.variant='primary'] - 按钮样式变体
 * @param {string} [props.size='md'] - 按钮尺寸
 * @param {boolean} [props.isDisabled=false] - 是否禁用
 * @param {boolean} [props.isLoading=false] - 是否显示加载状态
 * @param {Function} [props.onClick] - 点击事件处理函数
 * @param {React.ReactNode} props.children - 按钮内容
 * 
 * @returns {JSX.Element} 按钮组件
 * 
 * @example
 * // 基础用法
 * <Button onClick={() => console.log('clicked')}>
 *   点击我
 * </Button>
 * 
 * @example
 * // 不同变体
 * <Button variant="primary">主要按钮</Button>
 * <Button variant="secondary">次要按钮</Button>
 * <Button variant="outline">描边按钮</Button>
 * 
 * @example
 * // 加载状态
 * <Button isLoading>加载中...</Button>
 * 
 * @example
 * // 禁用状态
 * <Button isDisabled>已禁用</Button>
 */
export const Button: FC<ButtonProps> = ({ ... }) => {
  // ...
}
```

### 7.2 README文档

```markdown
# Button组件

通用按钮组件,支持多种样式和尺寸。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' | 'primary' | 按钮样式变体 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮尺寸 |
| isDisabled | boolean | false | 是否禁用 |
| isLoading | boolean | false | 是否显示加载状态 |
| onClick | () => void | - | 点击事件处理 |
| children | React.ReactNode | - | 按钮内容 |

## 使用示例

\```tsx
import { Button } from '@/components/ui/Button'

// 基础用法
<Button onClick={handleClick}>点击我</Button>

// 主要按钮
<Button variant="primary">主要按钮</Button>

// 大尺寸按钮
<Button size="lg">大按钮</Button>

// 加载状态
<Button isLoading>加载中...</Button>
\```

## 样式定制

可通过className属性自定义样式:

\```tsx
<Button className="w-full">全宽按钮</Button>
\```
```

---

## 八、测试规范

### 8.1 单元测试

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-primary-500')
  })
  
  it('disables when isDisabled is true', () => {
    render(<Button isDisabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
  })
  
  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('disabled')
  })
})
```

### 8.2 测试覆盖率

- 单元测试覆盖率 ≥ 80%
- 关键路径100%覆盖
- 边界条件完整测试

---

## 九、性能优化

### 9.1 React.memo

```typescript
import { memo } from 'react'

export const Button = memo<ButtonProps>(({ ... }) => {
  // ...
})
```

### 9.2 useMemo优化计算

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

### 9.3 useCallback优化函数

```typescript
const handleClick = useCallback(() => {
  // 处理点击
}, [])
```

### 9.4 懒加载

```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 十、最佳实践

### 10.1 组件拆分

**原则**: 单一职责,保持简单

```typescript
// ❌ 不好: 组件太复杂
const UserDashboard = () => {
  // 100+ 行代码
}

// ✅ 好: 拆分为多个子组件
const UserDashboard = () => {
  return (
    <>
      <UserHeader />
      <UserStats />
      <UserActivity />
      <UserSettings />
    </>
  )
}
```

### 10.2 Hooks提取

```typescript
// 提取自定义Hook
const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setIsLoading(false))
  }, [userId])
  
  return { user, isLoading }
}

// 组件中使用
const UserProfile = ({ userId }: { userId: string }) => {
  const { user, isLoading } = useUserData(userId)
  
  if (isLoading) return <Loading />
  if (!user) return <NotFound />
  
  return <div>{user.name}</div>
}
```

### 10.3 错误边界

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary fallback={<ErrorMessage />}>
  <UserProfile userId={userId} />
</ErrorBoundary>
```

### 10.4 避免Props钻取

```typescript
// ❌ 不好: Props层层传递
<ComponentA data={data}>
  <ComponentB data={data}>
    <ComponentC data={data}>
      <ComponentD data={data} />
    </ComponentC>
  </ComponentB>
</ComponentA>

// ✅ 好: 使用Context
const DataContext = createContext<Data | null>(null)

<DataContext.Provider value={data}>
  <ComponentA>
    <ComponentB>
      <ComponentC>
        <ComponentD />
      </ComponentC>
    </ComponentB>
  </ComponentA>
</DataContext.Provider>

// ComponentD中使用
const data = useContext(DataContext)
```

---

## 附录

### A. 参考资源

- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [Shadcn/ui组件库](https://ui.shadcn.com/)

### B. 相关文档

- [00-YYC3-XY-项目架构设计规范.md](./YYC3-XY-架构设计/00-YYC3-XY-项目架构设计规范.md)
- [design-tokens.ts](../lib/design-tokens.ts)

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
