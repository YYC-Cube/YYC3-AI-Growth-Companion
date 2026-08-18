# 统一排版规范使用指南

## 概述

本文档定义了YYC³项目的统一排版规范，确保所有文本具有一致的视觉表现和可读性。

## 排版变量

### 字体家族

| 变量 | 值 | 用途 |
|------|-----|------|
| `--font-sans` | Geist, sans-serif | 正文、标题 |
| `--font-serif` | Georgia, serif | 特殊用途 |
| `--font-mono` | Geist Mono, monospace | 代码、数字 |

### 字体大小 - 标题

| 变量 | 值 | 像素 | 用途 |
|------|-----|-------|------|
| `--text-h1` | 2.5rem | 40px | 主标题 |
| `--text-h2` | 2rem | 32px | 副标题 |
| `--text-h3` | 1.5rem | 24px | 三级标题 |
| `--text-h4` | 1.25rem | 20px | 四级标题 |
| `--text-h5` | 1.125rem | 18px | 五级标题 |
| `--text-h6` | 1rem | 16px | 六级标题 |

### 字体大小 - 正文

| 变量 | 值 | 像素 | 用途 |
|------|-----|-------|------|
| `--text-lg` | 1.125rem | 18px | 大号正文 |
| `--text-base` | 1rem | 16px | 标准正文 |
| `--text-sm` | 0.875rem | 14px | 小号正文 |
| `--text-xs` | 0.75rem | 12px | 超小文本 |
| `--text-xxs` | 0.625rem | 10px | 微小文本 |

### 字体粗细

| 变量 | 值 | 用途 |
|------|-----|------|
| `--font-thin` | 100 | 极细 |
| `--font-light` | 300 | 细体 |
| `--font-normal` | 400 | 正常 |
| `--font-medium` | 500 | 中等 |
| `--font-semibold` | 600 | 半粗 |
| `--font-bold` | 700 | 粗体 |
| `--font-extrabold` | 800 | 超粗 |

### 行高

| 变量 | 值 | 用途 |
|------|-----|------|
| `--leading-none` | 1 | 无行高 |
| `--leading-tight` | 1.25 | 紧凑 |
| `--leading-snug` | 1.375 | 适中 |
| `--leading-normal` | 1.5 | 正常 |
| `--leading-relaxed` | 1.625 | 宽松 |
| `--leading-loose` | 2 | 宽大 |

### 字间距

| 变量 | 值 | 用途 |
|------|-----|------|
| `--tracking-tighter` | -0.05em | 极紧 |
| `--tracking-tight` | -0.025em | 紧凑 |
| `--tracking-normal` | 0 | 正常 |
| `--tracking-wide` | 0.025em | 宽松 |
| `--tracking-wider` | 0.05em | 宽大 |
| `--tracking-widest` | 0.1em | 极宽 |

### 文本颜色

| 变量 | 用途 |
|------|------|
| `--text-primary` | 主要文本 |
| `--text-secondary` | 次要文本 |
| `--text-tertiary` | 辅助文本 |
| `--text-disabled` | 禁用文本 |
| `--text-inverse` | 反色文本 |
| `--text-link` | 链接文本 |
| `--text-success` | 成功文本 |
| `--text-warning` | 警告文本 |
| `--text-error` | 错误文本 |

## 排版工具类

### 标题样式

| 类名 | 字体大小 | 字重 | 行高 |
|------|---------|------|------|
| `.text-h1` | 40px | Bold | 1.25 |
| `.text-h2` | 32px | Bold | 1.25 |
| `.text-h3` | 24px | Semibold | 1.25 |
| `.text-h4` | 20px | Semibold | 1.375 |
| `.text-h5` | 18px | Medium | 1.375 |
| `.text-h6` | 16px | Medium | 1.5 |

### 正文样式

| 类名 | 字体大小 | 字重 | 行高 |
|------|---------|------|------|
| `.text-lg` | 18px | Normal | 1.625 |
| `.text-base` | 16px | Normal | 1.625 |
| `.text-sm` | 14px | Normal | 1.5 |
| `.text-xs` | 12px | Normal | 1.5 |
| `.text-xxs` | 10px | Normal | 1 |

### 文本颜色变体

| 类名 | 用途 |
|------|------|
| `.text-primary` | 主要文本 |
| `.text-secondary` | 次要文本 |
| `.text-tertiary` | 辅助文本 |
| `.text-disabled` | 禁用文本 |
| `.text-inverse` | 反色文本 |
| `.text-link` | 链接文本 |
| `.text-success` | 成功文本 |
| `.text-warning` | 警告文本 |
| `.text-error` | 错误文本 |

### 字体粗细变体

| 类名 | 字重 |
|------|------|
| `.font-thin` | 100 |
| `.font-light` | 300 |
| `.font-normal` | 400 |
| `.font-medium` | 500 |
| `.font-semibold` | 600 |
| `.font-bold` | 700 |
| `.font-extrabold` | 800 |

### 行高变体

| 类名 | 行高 |
|------|------|
| `.leading-none` | 1 |
| `.leading-tight` | 1.25 |
| `.leading-snug` | 1.375 |
| `.leading-normal` | 1.5 |
| `.leading-relaxed` | 1.625 |
| `.leading-loose` | 2 |

### 字间距变体

| 类名 | 字间距 |
|------|--------|
| `.tracking-tighter` | -0.05em |
| `.tracking-tight` | -0.025em |
| `.tracking-normal` | 0 |
| `.tracking-wide` | 0.025em |
| `.tracking-wider` | 0.05em |
| `.tracking-widest` | 0.1em |

### 文本对齐

| 类名 | 对齐方式 |
|------|----------|
| `.text-left` | 左对齐 |
| `.text-center` | 居中对齐 |
| `.text-right` | 右对齐 |
| `.text-justify` | 两端对齐 |

### 文本转换

| 类名 | 转换方式 |
|------|----------|
| `.text-uppercase` | 大写 |
| `.text-lowercase` | 小写 |
| `.text-capitalize` | 首字母大写 |

### 文本装饰

| 类名 | 装饰 |
|------|------|
| `.text-underline` | 下划线 |
| `.text-line-through` | 删除线 |
| `.text-no-decoration` | 无装饰 |

### 文本溢出

| 类名 | 效果 |
|------|------|
| `.text-truncate` | 单行截断 |
| `.text-ellipsis` | 省略号 |

## 使用示例

### 标题层级

```tsx
<h1 className="text-h1">主标题</h1>
<h2 className="text-h2">副标题</h2>
<h3 className="text-h3">三级标题</h3>
<h4 className="text-h4">四级标题</h4>
<h5 className="text-h5">五级标题</h5>
<h6 className="text-h6">六级标题</h6>
```

### 正文文本

```tsx
<p className="text-base">标准正文文本</p>
<p className="text-lg">大号正文文本</p>
<p className="text-sm">小号正文文本</p>
<p className="text-xs">超小文本</p>
```

### 文本颜色

```tsx
<p className="text-primary">主要文本</p>
<p className="text-secondary">次要文本</p>
<p className="text-tertiary">辅助文本</p>
<p className="text-success">成功消息</p>
<p className="text-warning">警告消息</p>
<p className="text-error">错误消息</p>
```

### 链接文本

```tsx
<a href="#" className="text-link">链接文本</a>
```

### 组合使用

```tsx
<h1 className="text-h2 font-bold text-primary">粗体主标题</h1>
<p className="text-base text-secondary leading-relaxed">宽松行高的次要文本</p>
<span className="text-sm text-tertiary tracking-wide">宽字间距的小号文本</span>
```

### 文本截断

```tsx
<div className="text-truncate max-w-xs">
  这是一段很长的文本，会被截断显示省略号...
</div>
```

## 排版层级指南

### H1 - 主标题
- **用途**：页面主标题、品牌名称
- **字体大小**：40px (移动端：32px)
- **字重**：Bold (700)
- **行高**：1.25
- **示例**：
```tsx
<h1 className="text-h1">YYC³ 智能插拔式移动AI系统</h1>
```

### H2 - 副标题
- **用途**：章节标题、主要区块标题
- **字体大小**：32px (移动端：28px)
- **字重**：Bold (700)
- **行高**：1.25
- **示例**：
```tsx
<h2 className="text-h2">成长记录</h2>
```

### H3 - 三级标题
- **用途**：子章节标题、卡片标题
- **字体大小**：24px (移动端：20px)
- **字重**：Semibold (600)
- **行高**：1.25
- **示例**：
```tsx
<h3 className="text-h3">运动发展</h3>
```

### H4 - 四级标题
- **用途**：小组块标题、列表标题
- **字体大小**：20px (移动端：18px)
- **字重**：Semibold (600)
- **行高**：1.375
- **示例**：
```tsx
<h4 className="text-h4">本周任务</h4>
```

### 正文 - 标准文本
- **用途**：主要内容、描述文本
- **字体大小**：16px
- **字重**：Normal (400)
- **行高**：1.625
- **示例**：
```tsx
<p className="text-base">这是标准正文文本，用于主要内容描述。</p>
```

### 正文 - 次要文本
- **用途**：辅助说明、提示文本
- **字体大小**：14px
- **字重**：Normal (400)
- **行高**：1.5
- **示例**：
```tsx
<p className="text-sm text-secondary">这是次要文本，用于辅助说明。</p>
```

## 响应式排版

### 移动端适配 (< 768px)

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| H1 | 40px | 32px |
| H2 | 32px | 28px |
| H3 | 24px | 20px |
| H4 | 20px | 18px |
| H5 | 18px | 16px |
| H6 | 16px | 14px |

### 小屏幕适配 (< 480px)

| 元素 | 桌面端 | 小屏幕 |
|------|--------|--------|
| H1 | 40px | 28px |
| H2 | 32px | 24px |
| H3 | 24px | 18px |
| H4 | 20px | 16px |
| H5 | 18px | 14px |
| H6 | 16px | 12px |

## 无障碍支持

### 可读性要求

- **最小字体大小**：14px（正文）
- **对比度**：至少4.5:1（WCAG AA标准）
- **行高**：至少1.5倍字体大小
- **字间距**：至少0.12em

### 减少动画支持

当用户偏好减少动画时，链接文本保持下划线显示：

```css
@media (prefers-reduced-motion: reduce) {
  .text-link {
    text-decoration: underline;
  }
}
```

## 最佳实践

### 1. 保持层级清晰

```tsx
<div>
  <h1 className="text-h2">主标题</h1>
  <h2 className="text-h3">副标题</h2>
  <p className="text-base">正文内容</p>
  <p className="text-sm text-secondary">辅助说明</p>
</div>
```

### 2. 使用语义化标签

```tsx
<h1 className="text-h1">页面标题</h1>
<h2 className="text-h2">章节标题</h2>
<h3 className="text-h3">子章节标题</h3>
```

### 3. 适当使用字重

```tsx
<h1 className="text-h2 font-bold">重要标题</h1>
<h2 className="text-h3 font-semibold">次要标题</h2>
<p className="text-base font-medium">强调文本</p>
```

### 4. 合理设置行高

```tsx
<p className="text-base leading-relaxed">
  这是长段落文本，使用宽松的行高提高可读性。
  宽松的行高让文本更容易阅读，特别是长段落。
</p>
```

### 5. 正确使用文本颜色

```tsx
<p className="text-primary">主要信息</p>
<p className="text-secondary">次要信息</p>
<p className="text-success">成功状态</p>
<p className="text-error">错误状态</p>
```

## 迁移指南

### 从Tailwind迁移到排版规范

**旧样式**：
```tsx
<h1 className="text-4xl font-bold">标题</h1>
<p className="text-base text-gray-600">正文</p>
<span className="text-sm text-gray-500">辅助文本</span>
```

**新样式**：
```tsx
<h1 className="text-h1">标题</h1>
<p className="text-base">正文</p>
<span className="text-sm text-secondary">辅助文本</span>
```

### 迁移检查清单

- [ ] 将 `text-*` 类替换为对应的排版类
- [ ] 将 `font-*` 类替换为对应的字重类
- [ ] 将 `leading-*` 类替换为对应的行高类
- [ ] 将 `tracking-*` 类替换为对应的字间距类
- [ ] 将颜色类替换为语义化的文本颜色类
- [ ] 测试响应式表现
- [ ] 测试暗色模式
- [ ] 测试无障碍性

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 相关文件

- `styles/typography.css` - 排版样式定义
- `styles/globals.css` - 全局样式（已引入typography.css）
- `components/ui/` - UI组件库

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2025-01-21 | 初始版本，定义统一排版规范 |
