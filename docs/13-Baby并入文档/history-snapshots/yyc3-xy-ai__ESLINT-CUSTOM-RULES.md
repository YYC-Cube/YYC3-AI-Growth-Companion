# ESLint自定义规则文档

## 概述

本文档描述了YYC³项目中使用的自定义ESLint规则，特别是针对硬编码颜色的检测规则。

## 自定义规则

### no-hardcoded-colors

**规则ID**: `no-hardcoded-colors/no-hardcoded-colors`

**类型**: `suggestion`

**严重级别**: `error`

**描述**: 禁止在代码中使用硬编码颜色值，强制使用CSS变量

## 规则目的

1. **统一颜色管理**：确保所有颜色都通过CSS变量定义，便于主题切换和维护
2. **提高可维护性**：修改颜色时只需更新CSS变量，无需搜索替换代码
3. **支持暗色模式**：使用CSS变量可以轻松实现暗色模式
4. **防止不一致**：避免不同组件使用相似但不完全相同的颜色值

## 检测范围

### 1. JSX属性

```tsx
// ❌ 错误 - 硬编码颜色
<div style={{ color: '#3b82f6' }}>文本</div>
<div className="bg-blue-500">背景</div>

// ✅ 正确 - 使用CSS变量
<div style={{ color: 'var(--color-blue)' }}>文本</div>
<div className="text-primary">背景</div>
```

### 2. 对象属性

```tsx
// ❌ 错误
const styles = {
  backgroundColor: '#ffffff',
  borderColor: '#ef4444',
};

// ✅ 正确
const styles = {
  backgroundColor: 'var(--color-white)',
  borderColor: 'var(--color-red)',
};
```

### 3. 字符串字面量

```tsx
// ❌ 错误
const color = '#10b981';
const gradient = 'linear-gradient(135deg, #3b82f6, #a855f7)';

// ✅ 正确
const color = 'var(--color-green)';
const gradient = 'linear-gradient(135deg, var(--color-blue), var(--color-purple))';
```

### 4. 模板字面量

```tsx
// ❌ 错误
const className = `bg-${color}-500`;
const style = `color: #${hexCode}`;

// ✅ 正确
const className = `text-${color}`;
const style = `color: var(--color-${color})`;
```

## 配置选项

### allowedColors

**类型**: `array`

**默认值**: `[]`

**描述**: 允许使用的硬编码颜色值列表

```javascript
{
  allowedColors: ['#ffffff', '#000000']
}
```

### allowedPatterns

**类型**: `array`

**默认值**: [`/^var\(--[\w-]+\)$/`, `/^transparent$/`]

**描述**: 允许的颜色值模式列表

```javascript
{
  allowedPatterns: [
    /^var\(--[\w-]+\)$/,    // CSS变量
    /^transparent$/,             // 透明色
    /^currentcolor$/,           // 当前颜色
  ]
}
```

### checkProperties

**类型**: `boolean`

**默认值**: `true`

**描述**: 是否检查对象属性中的颜色值

```javascript
{
  checkProperties: true
}
```

### checkStrings

**类型**: `boolean`

**默认值**: `true`

**描述**: 是否检查字符串字面量中的颜色值

```javascript
{
  checkStrings: true
}
```

### checkTemplateLiterals

**类型**: `boolean`

**默认值**: `true`

**描述**: 是否检查模板字面量中的颜色值

```javascript
{
  checkTemplateLiterals: true
}
```

## 颜色格式检测

规则会检测以下格式的硬编码颜色：

### 1. 十六进制颜色

```css
#fff
#ffffff
#3b82f6
#3B82F6
```

### 2. RGB颜色

```css
rgb(255, 255, 255)
rgb(59, 130, 246)
rgba(59, 130, 246, 0.5)
```

### 3. HSL颜色

```css
hsl(217, 91%, 60%)
hsla(217, 91%, 60%, 0.5)
```

## 错误消息

当检测到硬编码颜色时，ESLint会显示以下错误消息：

```
禁止使用硬编码颜色值 "#3b82f6"，请使用CSS变量（如 var(--color-blue)）代替
```

## 使用示例

### 基本配置

```javascript
// eslint.config.js
import customRules from './.eslintrc.custom-rules.js';

export default [
  {
    plugins: {
      'no-hardcoded-colors': customRules,
    },
    rules: {
      'no-hardcoded-colors/no-hardcoded-colors': 'error',
    },
  },
];
```

### 高级配置

```javascript
// eslint.config.js
import customRules from './.eslintrc.custom-rules.js';

export default [
  {
    plugins: {
      'no-hardcoded-colors': customRules,
    },
    rules: {
      'no-hardcoded-colors/no-hardcoded-colors': [
        'error',
        {
          allowedColors: ['#ffffff', '#000000'], // 允许黑白
          allowedPatterns: [
            /^var\(--[\w-]+\)$/,    // CSS变量
            /^transparent$/,             // 透明色
            /^currentcolor$/,           // 当前颜色
          ],
          checkProperties: true,
          checkStrings: true,
          checkTemplateLiterals: true,
        },
      ],
    },
  },
];
```

## 迁移指南

### 从硬编码颜色迁移到CSS变量

**步骤1**: 在 `styles/globals.css` 中定义颜色变量

```css
:root {
  --color-blue: #3b82f6;
  --color-red: #ef4444;
  --color-green: #10b981;
}
```

**步骤2**: 在代码中使用CSS变量

```tsx
// ❌ 旧代码
<div style={{ backgroundColor: '#3b82f6' }} />
<span className="text-red-500">错误</span>

// ✅ 新代码
<div style={{ backgroundColor: 'var(--color-blue)' }} />
<span className="text-error">错误</span>
```

### 批量替换

使用以下正则表达式进行批量替换：

```javascript
// 十六进制颜色
/#([0-9a-fA-F]{3,6})\b/g

// RGB颜色
/rgba?\((\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*)\)/g

// HSL颜色
/hsla?\((\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?(\s*,\s*[\d.]+)?\s*)\)/g
```

## 常见问题

### Q1: 为什么不能使用Tailwind的颜色类？

**A**: Tailwind的颜色类（如 `bg-blue-500`）也是硬编码颜色。建议使用语义化的CSS变量类（如 `text-primary`、`text-error`）或定义自己的颜色类。

### Q2: 如何处理动态颜色？

**A**: 使用CSS变量或条件类名：

```tsx
// ❌ 错误
<div style={{ color: `#${hexCode}` }} />

// ✅ 正确
<div style={{ color: `var(--color-${colorName})` }} />
<div className={`text-${colorType}`} />
```

### Q3: 第三方库的颜色怎么办？

**A**: 在ESLint配置中添加允许的颜色或禁用特定文件的检查：

```javascript
overrides: [
  {
    files: ['node_modules/**', 'components/third-party/**'],
    rules: {
      'no-hardcoded-colors/no-hardcoded-colors': 'off',
    },
  },
]
```

### Q4: 如何临时禁用规则？

**A**: 使用ESLint注释：

```tsx
// eslint-disable-next-line no-hardcoded-colors/no-hardcoded-colors
const specialColor = '#ff0000';
```

## 最佳实践

### 1. 优先使用语义化颜色

```tsx
// ❌ 错误
<span className="text-red-500">错误</span>
<span className="text-green-500">成功</span>

// ✅ 正确
<span className="text-error">错误</span>
<span className="text-success">成功</span>
```

### 2. 使用CSS变量进行主题化

```css
/* 定义颜色变量 */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}

.dark {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
}
```

### 3. 创建颜色工具类

```tsx
// 定义语义化颜色类
const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
};

// 使用
<span className={colorClasses[type]}>消息</span>
```

## 相关文档

- [ESLint自定义规则开发指南](https://eslint.org/docs/latest/extend/custom-rules)
- [YYC³颜色系统](../styles/globals.css)
- [卡片样式规范](./CARD-STYLES-GUIDE.md)
- [排版规范](./TYPOGRAPHY-GUIDE.md)

## 维护指南

### 添加新的颜色变量

1. 在 `styles/globals.css` 中定义新的颜色变量
2. 更新本文档中的颜色变量列表
3. 测试ESLint规则是否正确识别新变量
4. 更新相关组件以使用新变量

### 修改规则逻辑

1. 编辑 `.eslintrc.custom-rules.js` 文件
2. 修改正则表达式或检测逻辑
3. 测试规则在各种场景下的表现
4. 更新本文档

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2025-01-21 | 初始版本，实现硬编码颜色检测规则 |
