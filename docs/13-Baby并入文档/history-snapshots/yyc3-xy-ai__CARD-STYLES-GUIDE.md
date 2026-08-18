# 统一卡片样式规范使用指南

## 概述

本文档定义了YYC³项目的统一卡片样式规范，确保所有卡片组件具有一致的视觉表现和交互体验。

## 卡片样式类

### 基础卡片类

| 类名 | 用途 | 圆角 | 内边距 | 阴影 |
|------|------|--------|---------|-------|
| `.card` | 标准卡片 | 1rem | 1rem | 标准阴影 |
| `.card-sm` | 小型卡片 | 0.5rem | 0.75rem | 小阴影 |
| `.card-md` | 中型卡片 | 0.75rem | 1rem | 标准阴影 |
| `.card-lg` | 大型卡片 | 1rem | 1.5rem | 中阴影 |
| `.card-xl` | 超大卡片 | 1.25rem | 2rem | 大阴影 |
| `.card-2xl` | 特大卡片 | 1.5rem | 2rem | 大阴影 |
| `.card-3xl` | 巨型卡片 | 2rem | 2.5rem | 超大阴影 |

### 阴影变体

| 类名 | 阴影强度 |
|------|----------|
| `.card-shadow-sm` | 小阴影 |
| `.card-shadow` | 标准阴影 |
| `.card-shadow-md` | 中阴影 |
| `.card-shadow-lg` | 大阴影 |
| `.card-shadow-xl` | 超大阴影 |
| `.card-shadow-2xl` | 特大阴影 |

### 交互效果

| 类名 | 效果 |
|------|------|
| `.card-hover` | 悬停时阴影增强 |
| `.card-clickable` | 可点击卡片，悬停时上移 |
| `.card-elevated` | 悬浮效果 |

### 边框变体

| 类名 | 边框颜色 |
|------|----------|
| `.card-border` | 默认边框 |
| `.card-border-none` | 无边框 |
| `.card-border-gray` | 灰色边框 |
| `.card-border-blue` | 蓝色边框 |
| `.card-border-purple` | 紫色边框 |

### 特殊样式

| 类名 | 效果 |
|------|------|
| `.card-gradient` | 蓝紫渐变背景 |
| `.card-gradient-pink` | 粉紫渐变背景 |
| `.card-gradient-blue` | 蓝色渐变背景 |
| `.card-glass` | 毛玻璃效果 |

## 使用示例

### 基础卡片

```tsx
<div className="card">
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</div>
```

### 可点击卡片

```tsx
<div className="card card-clickable" onClick={handleClick}>
  <h3>可点击的卡片</h3>
  <p>点击此卡片执行操作</p>
</div>
```

### 渐变卡片

```tsx
<div className="card card-gradient">
  <h3>渐变卡片</h3>
  <p>带有蓝紫渐变背景</p>
</div>
```

### 毛玻璃卡片

```tsx
<div className="card card-glass">
  <h3>毛玻璃卡片</h3>
  <p>半透明背景带模糊效果</p>
</div>
```

### 组合使用

```tsx
<div className="card card-xl card-hover card-border-blue">
  <h3>大型可悬停卡片</h3>
  <p>组合多个样式类</p>
</div>
```

## CSS变量

### 圆角变量

```css
--card-border-radius-sm: 0.5rem;
--card-border-radius-md: 0.75rem;
--card-border-radius-lg: 1rem;
--card-border-radius-xl: 1.25rem;
--card-border-radius-2xl: 1.5rem;
--card-border-radius-3xl: 2rem;
```

### 阴影变量

```css
--card-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--card-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--card-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--card-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--card-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--card-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### 内边距变量

```css
--card-padding-sm: 0.75rem;
--card-padding: 1rem;
--card-padding-md: 1.5rem;
--card-padding-lg: 2rem;
--card-padding-xl: 2.5rem;
```

## 迁移指南

### 从旧样式迁移到新规范

**旧样式**：
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6">
  内容
</div>
```

**新样式**：
```tsx
<div className="card card-2xl">
  内容
</div>
```

### 迁移检查清单

- [ ] 将 `bg-white` 替换为 `.card` 类
- [ ] 将 `rounded-*` 替换为对应的 `.card-*` 类
- [ ] 将 `shadow-*` 替换为对应的 `.card-shadow-*` 类
- [ ] 将 `p-*` 替换为对应的卡片内边距
- [ ] 测试响应式表现
- [ ] 测试暗色模式

## 最佳实践

1. **优先使用预定义类**：避免直接使用Tailwind类，使用预定义的卡片类
2. **保持一致性**：相同类型的卡片使用相同的样式类
3. **考虑响应式**：在移动设备上使用较小的卡片尺寸
4. **支持暗色模式**：确保卡片在暗色模式下也有良好的表现
5. **性能优化**：避免过度使用阴影和渐变效果

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 维护指南

### 添加新的卡片样式

1. 在 `styles/card-styles.css` 中定义新的CSS类
2. 在本文档中添加说明
3. 更新示例代码
4. 测试所有浏览器兼容性

### 修改现有样式

1. 评估影响范围
2. 更新CSS变量
3. 测试所有使用该样式的组件
4. 更新文档

## 相关文件

- `styles/card-styles.css` - 卡片样式定义
- `styles/globals.css` - 全局样式（已引入card-styles.css）
- `components/ui/` - UI组件库

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2025-01-21 | 初始版本，定义基础卡片样式规范 |
