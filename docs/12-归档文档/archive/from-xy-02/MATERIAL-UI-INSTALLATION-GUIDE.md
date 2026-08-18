# Material-UI 组件库安装指南

## 📋 概述

本文档记录从 yyc3-xy-02 整合 Material-UI 组件库的安装步骤和使用指南。

**来源**：yyc3-xy-02
**目的**：扩展 UI 组件库，提供更多组件选择
**优先级**：P1

---

## 1. 依赖安装

### 1.1 安装 Material-UI 及相关依赖

```bash
# 安装 Material-UI 核心库
bun add @mui/material ^7.3.6

# 安装 Material-UI 图标库
bun add @mui/icons-material ^7.3.6

# 安装 Emotion 相关依赖（Material-UI 的样式引擎）
bun add @emotion/react ^11.14.0
bun add @emotion/styled ^11.14.1

# 安装属性验证工具（可选，用于开发）
bun add @emotion/is-prop-valid
```

### 1.2 更新 package.json

安装后，`package.json` 中应包含以下依赖：

```json
{
  "dependencies": {
    "@mui/material": "^7.3.6",
    "@mui/icons-material": "^7.3.6",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@emotion/is-prop-valid": "latest"
  }
}
```

---

## 2. 主题配置

### 2.1 创建 Material-UI 主题

在 `/components/material/theme.ts` 中创建主题配置：

```typescript
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { Roboto } from 'next/font/google'

// 配置字体
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

// 创建主题
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    // 自定义组件样式
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
})

// 响应式字体
theme = responsiveFontSizes(theme)

export default theme
```

### 2.2 创建 Theme Provider

在 `/components/material/MuiThemeProvider.tsx` 中创建 Theme Provider：

```typescript
'use client'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
```

### 2.3 集成到应用

在 `app/layout.tsx` 中集成 Theme Provider：

```typescript
import { MuiThemeProvider } from '@/components/material/MuiThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <MuiThemeProvider>
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  )
}
```

---

## 3. 组件使用示例

### 3.1 基础组件

```typescript
import { Button, TextField, Select, MenuItem } from '@mui/material'

export function MaterialUIExample() {
  return (
    <div>
      {/* 按钮 */}
      <Button variant="contained" color="primary">
        Material-UI 按钮
      </Button>

      {/* 输入框 */}
      <TextField
        label="用户名"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      {/* 下拉选择 */}
      <Select
        label="选择角色"
        variant="outlined"
        fullWidth
        margin="normal"
      >
        <MenuItem value="xiaoyan">小燕</MenuItem>
        <MenuItem value="xiaoyu">小语</MenuItem>
      </Select>
    </div>
  )
}
```

### 3.2 高级组件

#### DatePicker（日期选择器）

```typescript
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export function DatePickerExample() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker label="选择日期" />
    </LocalizationProvider>
  )
}
```

#### DataGrid（数据表格）

```typescript
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: '姓名', width: 150 },
  { field: 'age', headerName: '年龄', type: 'number', width: 110 },
]

const rows = [
  { id: 1, name: '小燕', age: 8 },
  { id: 2, name: '小语', age: 7 },
]

export function DataGridExample() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  )
}
```

#### Autocomplete（自动完成）

```typescript
import { Autocomplete, TextField } from '@mui/material'

const options = ['小燕', '小语', '小明', '小红']

export function AutocompleteExample() {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => (
        <TextField {...params} label="搜索角色" variant="outlined" />
      )}
    />
  )
}
```

---

## 4. 推荐使用的 Material-UI 组件

| 组件 | 用途 | 替代 Radix UI |
|------|------|--------------|
| `Button` | 按钮 | 可选 |
| `TextField` | 输入框 | 可选 |
| `Select` | 下拉选择 | 可选 |
| `DatePicker` | 日期选择 | **推荐** ⭐ |
| `TimePicker` | 时间选择 | **推荐** ⭐ |
| `Table` | 表格 | 可选 |
| `DataGrid` | 数据表格 | **推荐** ⭐ |
| `Autocomplete` | 自动完成 | **推荐** ⭐ |
| `Tabs` | 标签页 | 可选 |
| `Accordion` | 手风琴 | 可选 |
| `Dialog` | 对话框 | 可选 |
| `Snackbar` | 消息提示 | 可选 |
| `Menu` | 菜单 | 可选 |
| `Drawer` | 抽屉 | 可选 |

---

## 5. 组件封装

为了统一风格，建议封装常用的 Material-UI 组件。

### 5.1 封装按钮

在 `/components/material/MuiButton.tsx` 中：

```typescript
import { Button, ButtonProps } from '@mui/material'

export interface MuiButtonProps extends ButtonProps {
  variant?: 'text' | 'contained' | 'outlined'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
}

export function MuiButton({ children, ...props }: MuiButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        fontWeight: 500,
        ...props.sx,
      }}
    >
      {children}
    </Button>
  )
}
```

### 5.2 封装输入框

在 `/components/material/MuiTextField.tsx` 中：

```typescript
import { TextField, TextFieldProps } from '@mui/material'

export interface MuiTextFieldProps extends TextFieldProps {
  label?: string
  error?: boolean
  helperText?: string
}

export function MuiTextField({ ...props }: MuiTextFieldProps) {
  return (
    <TextField
      {...props}
      variant="outlined"
      fullWidth
      margin="normal"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...props.sx,
      }}
    />
  )
}
```

---

## 6. 最佳实践

### 6.1 组件选择原则

- **默认使用 Radix UI**：Radix UI 是无头组件库，更符合现代前端设计
- **复杂组件使用 Material-UI**：如 DatePicker、DataGrid、Autocomplete 等
- **保持风格统一**：不要混用太多组件库，保持视觉一致性

### 6.2 样式隔离

为了避免样式冲突，建议：

1. 使用 CSS Module 或 styled-components 隔离样式
2. 为 Material-UI 组件设置独立的类名
3. 使用 Material-UI 的 `sx` prop 而不是全局 CSS

### 6.3 性能优化

1. 按需导入组件：
```typescript
// ❌ 不要这样做
import { Button, TextField } from '@mui/material'

// ✅ 推荐这样做
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
```

2. 使用代码分割：
```typescript
import dynamic from 'next/dynamic'

const DataGrid = dynamic(() => import('@mui/x-data-grid'), {
  ssr: false,
  loading: () => <p>加载中...</p>,
})
```

---

## 7. 兼容性说明

### 7.1 与 Radix UI 的兼容性

Material-UI 和 Radix UI 可以并存，但需要注意：

- **样式冲突**：Material-UI 使用 Emotion，Radix UI 可以使用任何样式方案
- **事件处理**：两者都支持 React 事件系统，无冲突
- **主题切换**：需要分别处理两者的主题

### 7.2 与 Tailwind CSS 的兼容性

Material-UI 和 Tailwind CSS 可以很好地配合使用：

```typescript
<TextField
  className="w-full px-4 py-2"
  sx={{ borderRadius: 2 }}
/>
```

---

## 8. 安装清单

- [ ] 安装 Material-UI 核心依赖
- [ ] 安装 Material-UI 图标库
- [ ] 安装 Emotion 相关依赖
- [ ] 创建主题配置文件
- [ ] 创建 Theme Provider
- [ ] 集成到应用布局
- [ ] 封装常用组件
- [ ] 编写使用示例
- [ ] 更新组件文档

---

## 9. 参考资源

- [Material-UI 官方文档](https://mui.com/)
- [Material-UI 组件示例](https://mui.com/material-ui/all-components/)
- [Emotion 官方文档](https://emotion.sh/docs)
- [Material-UI 与 Next.js 集成指南](https://mui.com/material-ui/guides/next-js/)

---

**文档创建时间**：2026-01-03
**来源项目**：yyc3-xy-02
**状态**：✅ 待实施
