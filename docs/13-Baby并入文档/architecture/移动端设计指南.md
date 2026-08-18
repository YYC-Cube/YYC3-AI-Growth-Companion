# 响应式设计指南

## 📋 概述

本文档描述小语智能成长守护系统的响应式设计规范和实现方案。

---

## 🎯 设计目标

### 目标评分: 90/100分 ✅

### 核心原则

1. **Mobile First**: 优先设计移动端体验
2. **渐进增强**: 从基础功能到高级特性逐步增强
3. **性能优先**: 确保各设备流畅运行
4. **一致性**: 跨设备保持一致的用户体验
5. **可访问性**: 支持各种交互方式

---

## 📐 断点系统

### Tailwind CSS断点

```css
/* 小屏手机 */
/* default */
@media (min-width: 0px) { ... }

/* 大屏手机 → 小平板 */
sm: 640px
@media (min-width: 640px) { ... }

/* 平板 */
md: 768px
@media (min-width: 768px) { ... }

/* 桌面 */
lg: 1024px
@media (min-width: 1024px) { ... }

/* 大桌面 */
xl: 1280px
@media (min-width: 1280px) { ... }

/* 超大桌面 */
2xl: 1536px
@media (min-width: 1536px) { ... }
```

### 设备分类

| 设备类型 | 屏幕宽度 | 断点 |
|---------|---------|------|
| 手机（竖屏） | 320-639px | default |
| 手机（横屏）/小平板 | 640-767px | sm |
| 平板 | 768-1023px | md |
| 桌面 | 1024-1279px | lg |
| 大桌面 | 1280-1535px | xl |
| 超大桌面 | 1536px+ | 2xl |

---

## 🎨 响应式布局

### 网格系统

```tsx
// 响应式网格
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>
```

### 布局模式

#### 1. 单列 → 双列 → 多列

```tsx
// 移动端: 1列
// 平板: 2列
// 桌面: 3列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 内容 */}
</div>
```

#### 2. 侧边栏布局

```tsx
// 移动端: 垂直堆叠
// 桌面: 侧边栏 + 主内容
<div className="flex flex-col lg:flex-row gap-6">
  <aside className="lg:w-64">侧边栏</aside>
  <main className="flex-1">主内容</main>
</div>
```

#### 3. 卡片网格

```tsx
// 自适应卡片尺寸
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

---

## 📱 移动端优化

### 触摸目标

**最小尺寸: 44x44px**

```tsx
// ✅ 触摸友好
<button className="min-w-[44px] min-h-[44px] p-3">
  <Icon />
</button>

// ❌ 触摸目标过小
<button className="p-1">
  <Icon size={12} />
</button>
```

### 字体大小

```css
/* 移动端最小字体: 14px */
.text-responsive {
  font-size: 14px; /* mobile */
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: 16px; /* tablet/desktop */
  }
}
```

### 间距调整

```tsx
// 响应式间距
<div className="p-4 sm:p-6 lg:p-8">
  {/* 内容 */}
</div>

// 响应式gap
<div className="flex gap-2 sm:gap-4 lg:gap-6">
  {/* 内容 */}
</div>
```

### 导航优化

```tsx
// 移动端：汉堡菜单
// 桌面端：横向导航
<nav>
  {/* 移动端 */}
  <div className="lg:hidden">
    <MobileMenu />
  </div>
  
  {/* 桌面端 */}
  <div className="hidden lg:flex gap-6">
    <NavLink />
    <NavLink />
  </div>
</nav>
```

---

## 💻 桌面端优化

### 多列布局

```tsx
// 充分利用桌面空间
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* 左侧：主内容 (2列) */}
  <div className="lg:col-span-2">
    <MainContent />
  </div>
  
  {/* 右侧：侧边栏 (1列) */}
  <aside className="lg:col-span-1">
    <Sidebar />
  </aside>
</div>
```

### 鼠标交互

```tsx
// 桌面端hover效果
<Card className="
  transition-all
  hover:shadow-lg
  hover:-translate-y-1
  active:scale-95
">
  {/* 内容 */}
</Card>
```

---

## 📊 响应式图表

### Recharts响应式配置

```tsx
import { ResponsiveContainer, LineChart } from 'recharts'

<ResponsiveContainer 
  width="100%" 
  height={250}
  className="sm:h-[300px] lg:h-[400px]"
>
  <LineChart data={data}>
    {/* 图表配置 */}
  </LineChart>
</ResponsiveContainer>
```

---

## 🖼️ 响应式图片

### Picture元素

```tsx
<picture>
  {/* 桌面端 */}
  <source 
    media="(min-width: 1024px)" 
    srcSet="/images/large.jpg" 
  />
  
  {/* 平板 */}
  <source 
    media="(min-width: 768px)" 
    srcSet="/images/medium.jpg" 
  />
  
  {/* 移动端 */}
  <img 
    src="/images/small.jpg" 
    alt="描述"
    loading="lazy"
  />
</picture>
```

### 懒加载

```tsx
<img 
  src={imageUrl}
  alt="描述"
  loading="lazy"
  className="w-full h-auto"
/>
```

---

## 🎯 性能优化

### 条件渲染

```tsx
import { useDeviceType } from './utils/responsive'

function Component() {
  const deviceType = useDeviceType()
  
  return (
    <>
      {deviceType === 'mobile' && <MobileView />}
      {deviceType === 'tablet' && <TabletView />}
      {deviceType === 'desktop' && <DesktopView />}
    </>
  )
}
```

### CSS优化

```css
/* 使用transform代替top/left */
.element {
  transform: translateX(0);
  transition: transform 0.3s;
}

.element:hover {
  transform: translateX(10px);
}
```

---

## 📏 设计规范

### 间距系统

```css
/* 基于4px基准 */
xs: 4px   (0.25rem)
sm: 8px   (0.5rem)
md: 16px  (1rem)
lg: 24px  (1.5rem)
xl: 32px  (2rem)
2xl: 48px (3rem)
```

### 字体系统

```css
/* 移动端 */
xs: 12px
sm: 14px
base: 16px
lg: 18px
xl: 20px

/* 桌面端 */
xs: 12px
sm: 14px
base: 16px
lg: 18px
xl: 20px
2xl: 24px
```

---

## ✅ 响应式检查清单

### 移动端 (< 640px)

- [ ] 字体大小 ≥ 14px
- [ ] 触摸目标 ≥ 44x44px
- [ ] 单列布局
- [ ] 汉堡菜单
- [ ] 横向滚动优化
- [ ] 加载状态明显

### 平板端 (640px - 1023px)

- [ ] 双列布局
- [ ] 适当的间距
- [ ] 图表可见性
- [ ] 触摸友好
- [ ] 横竖屏适配

### 桌面端 (≥ 1024px)

- [ ] 多列布局
- [ ] Hover效果
- [ ] 充分利用空间
- [ ] 键盘导航
- [ ] 快捷键支持

---

## 🧪 测试策略

### 设备测试

**必测设备**:

- iPhone SE (375px)
- iPhone 12 (390px)
- iPad (768px)
- iPad Pro (1024px)
- MacBook (1440px)

### 浏览器测试

**必测浏览器**:

- Chrome (最新版)
- Safari (最新版)
- Firefox (最新版)
- Edge (最新版)

### 测试工具

- Chrome DevTools (Device Mode)
- Firefox Responsive Design Mode
- BrowserStack
- LambdaTest

---

## 📚 工具和资源

### 响应式工具函数

```typescript
// apps/web/src/utils/responsive.ts

import { useState, useEffect } from 'react'

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return deviceType
}
```

---

## 🎓 最佳实践

### DO（推荐）

✅ Mobile First设计  
✅ 使用相对单位（rem, %, vw）  
✅ 测试真实设备  
✅ 优化触摸交互  
✅ 提供加载反馈  
✅ 优化图片和资源  

### DON'T（不推荐）

❌ 固定像素尺寸  
❌ 仅在桌面端测试  
❌ 忽略触摸目标大小  
❌ 过多的动画  
❌ 未压缩的图片  

---

**文档版本**: v1.0  
**最后更新**: 2024年11月26日
