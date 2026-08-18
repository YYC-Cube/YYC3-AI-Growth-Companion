# 组件库完整文档

## 📋 目录

- [基础组件](#基础组件)
- [布局组件](#布局组件)
- [表单组件](#表单组件)
- [反馈组件](#反馈组件)
- [数据展示组件](#数据展示组件)
- [导航组件](#导航组件)
- [业务组件](#业务组件)

---

## 基础组件

### Button（按钮）

**路径**: `apps/web/src/components/ui/Button.tsx`

通用按钮组件，支持多种样式、大小和状态。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' | 'primary' | 按钮样式变体 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮大小 |
| loading | boolean | false | 是否显示加载状态 |
| block | boolean | false | 是否占满父容器宽度 |
| leftIcon | ReactNode | - | 左侧图标 |
| rightIcon | ReactNode | - | 右侧图标 |
| disabled | boolean | false | 是否禁用 |

#### 示例

```tsx
import { Button } from './components/ui/Button'
import { Plus, Save } from 'lucide-react'

// 基础使用
<Button>点击我</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="danger">危险按钮</Button>

// 带图标
<Button leftIcon={<Plus />}>添加</Button>
<Button rightIcon={<Save />}>保存</Button>

// 加载状态
<Button loading>加载中...</Button>

// 块级按钮
<Button block>全宽按钮</Button>
```

---

### Card（卡片）

**路径**: `apps/web/src/components/ui/Card.tsx`

统一的卡片容器组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| header | string \| ReactNode | - | 卡片头部 |
| description | string | - | 描述文字 |
| footer | ReactNode | - | 卡片底部 |
| padding | 'none' \| 'sm' \| 'md' \| 'lg' | 'md' | 内边距 |
| variant | 'default' \| 'ghost' \| 'outline' | 'default' | 样式变体 |
| flat | boolean | false | 是否扁平化（无阴影） |

#### 示例

```tsx
import { Card } from './components/ui/Card'

// 基础使用
<Card header="标题">内容</Card>

// 带描述和底部
<Card 
  header="用户信息" 
  description="查看和编辑用户信息"
  footer={<Button>保存</Button>}
>
  <UserForm />
</Card>

// 自定义内边距
<Card padding="lg">
  宽松的内边距
</Card>
```

---

## 反馈组件

### Loading（加载）

**路径**: `apps/web/src/components/ui/Loading.tsx`

统一的加载状态组件。

#### 组件变体

- `Loading`: 基础加载组件
- `PageLoading`: 页面级加载（全屏）
- `CardLoading`: 卡片级加载（骨架屏）

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | 加载器大小 |
| variant | 'spinner' \| 'dots' \| 'skeleton' | 'spinner' | 加载样式 |
| text | string | - | 加载提示文字 |
| fullScreen | boolean | false | 是否全屏显示 |

#### 示例

```tsx
import { Loading, PageLoading, CardLoading } from './components/ui/Loading'

// 基础加载
<Loading size="md" variant="spinner" text="加载中..." />

// 页面级加载
<PageLoading text="页面加载中..." />

// 卡片骨架屏
<CardLoading />

// 自定义样式
<Loading 
  size="lg" 
  variant="dots" 
  fullScreen 
/>
```

---

### EmptyState（空状态）

**路径**: `apps/web/src/components/ui/EmptyState.tsx`

优雅的空状态展示组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'default' \| 'search' \| 'error' \| 'folder' \| 'favorite' | 'default' | 空状态类型 |
| title | string | - | 主标题 |
| description | string | - | 描述文字 |
| icon | ReactNode | - | 自定义图标 |
| action | { label: string, onClick: () => void } | - | 主要操作 |
| secondaryAction | { label: string, onClick: () => void } | - | 次要操作 |

#### 示例

```tsx
import { EmptyState } from './components/ui/EmptyState'

// 默认空状态
<EmptyState
  type="default"
  title="暂无数据"
  description="开始创建您的第一条记录吧~"
  action={{
    label: "创建记录",
    onClick: handleCreate
  }}
/>

// 搜索结果为空
<EmptyState
  type="search"
  title="未找到相关内容"
  description="试试其他关键词或调整筛选条件"
  action={{
    label: "清除筛选",
    onClick: handleClear
  }}
/>

// 自定义图标
<EmptyState
  icon={<CustomIcon />}
  title="自定义空状态"
/>
```

---

### ErrorState（错误状态）

**路径**: `apps/web/src/components/ui/ErrorState.tsx`

友好的错误状态展示组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '出错了' | 错误标题 |
| description | string | - | 错误描述 |
| error | Error \| string | - | 错误对象 |
| showRetry | boolean | true | 是否显示重试按钮 |
| onRetry | () => void | - | 重试回调 |
| showBack | boolean | false | 是否显示返回按钮 |
| showHome | boolean | false | 是否显示首页按钮 |

#### 示例

```tsx
import { ErrorState } from './components/ui/ErrorState'

// 基础使用
<ErrorState
  title="加载失败"
  description="网络连接出现问题"
  showRetry
  onRetry={handleRetry}
/>

// 使用错误对象
<ErrorState
  error={error}
  showRetry
  onRetry={handleRetry}
  showHome
/>

// 自定义操作
<ErrorState
  title="权限不足"
  description="您没有访问此页面的权限"
  showBack
  showHome
/>
```

---

### Feedback（反馈）

**路径**: `apps/web/src/components/ui/Feedback.tsx`

操作反馈提示组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'success' \| 'error' \| 'warning' \| 'info' | - | 反馈类型 |
| message | string | - | 反馈消息 |
| duration | number | 3000 | 持续时间（毫秒），0表示不自动关闭 |
| closable | boolean | true | 是否可关闭 |
| onClose | () => void | - | 关闭回调 |

#### 示例

```tsx
import { Feedback, FeedbackManager } from './components/ui/Feedback'

// 基础使用
<Feedback
  type="success"
  message="操作成功！"
  duration={3000}
/>

// 不同类型
<Feedback type="error" message="操作失败" />
<Feedback type="warning" message="请注意" />
<Feedback type="info" message="提示信息" />

// 全局反馈管理器
const [feedback, setFeedback] = useState(null)

<FeedbackManager 
  feedback={feedback} 
  onClose={() => setFeedback(null)} 
/>

// 触发反馈
setFeedback({
  type: 'success',
  message: '保存成功！'
})
```

---

## 🎬 动画组件

### PageTransition（页面过渡）

**路径**: `apps/web/src/components/ui/PageTransition.tsx`

页面切换动画组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'fade' \| 'slide' \| 'scale' \| 'none' | 'fade' | 过渡效果 |
| enabled | boolean | true | 是否启用动画 |

#### 示例

```tsx
import { PageTransition, RouteTransition } from './components/ui/PageTransition'

// 页面级使用
export default function MyPage() {
  return (
    <PageTransition variant="fade">
      <div>页面内容</div>
    </PageTransition>
  )
}

// 路由级使用
<RouteTransition locationKey={location.pathname}>
  <YourContent />
</RouteTransition>
```

---

## ♿ 可访问性组件

### SkipLink（跳过链接）

**路径**: `apps/web/src/components/ui/Accessibility.tsx`

键盘导航辅助组件。

#### 示例

```tsx
import { SkipLink, FocusManager, ScreenReaderText } from './components/ui/Accessibility'

// 跳过链接
<SkipLink target="#main-content" label="跳到主要内容" />

<main id="main-content">
  {/* 主要内容 */}
</main>

// 焦点管理
<FocusManager autoFocus trap>
  <Modal>对话框内容</Modal>
</FocusManager>

// 屏幕阅读器文本
<button>
  <Icon />
  <ScreenReaderText>关闭</ScreenReaderText>
</button>
```

---

## 🎨 使用最佳实践

### 1. 组件组合

```tsx
// ✅ 推荐：组合使用基础组件
<Card header="用户列表">
  {loading ? (
    <CardLoading />
  ) : error ? (
    <ErrorState error={error} showRetry onRetry={handleRetry} />
  ) : users.length === 0 ? (
    <EmptyState 
      type="default" 
      title="暂无用户"
      action={{ label: "添加用户", onClick: handleAdd }}
    />
  ) : (
    <UserList users={users} />
  )}
</Card>
```

### 2. 状态管理

```tsx
// ✅ 推荐：统一的状态管理模式
const [loading, setLoading] = useState(true)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState([])

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  setLoading(true)
  setError(null)
  try {
    const result = await api.getData()
    setData(result)
  } catch (err) {
    setError(err)
  } finally {
    setLoading(false)
  }
}
```

### 3. 响应式设计

```tsx
// ✅ 推荐：使用响应式类名
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</div>
```

---

**文档版本**: v1.0  
**最后更新**: 2024年11月
