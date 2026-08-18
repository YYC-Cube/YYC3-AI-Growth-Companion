# 开发者文档

## 项目概述

小语AI应用是一个基于 React + Tailwind CSS 构建的 Web 应用，旨在为7-9岁儿童提供AI辅助的成长记录和河洛文化探索体验。

## 目录结构

```
src/
├── app/
│   ├── App.tsx                 # 主应用入口，包含路由逻辑
│   ├── components/             # 组件目录
│   │   ├── ai/                 # AI相关组件（如悬浮窗）
│   │   ├── business/           # 业务组件（如成长卡片、轮播图）
│   │   ├── foundation/         # 基础UI组件（Button, Card等）
│   │   ├── layout/             # 布局组件（Header, PageNavigation）
│   │   ├── pages/              # 页面级组件
│   │   └── system/             # 系统级组件（全局导航）
│   ├── services/               # 服务层（API调用、数据管理）
│   └── contexts/               # React Contexts (如NavigationContext)
```

## 核心开发规范

### 1. 页面导航

所有二级页面应使用 `PageNavigation` 组件作为头部。

```tsx
import { PageNavigation } from '../layout/PageNavigation';

const MyPage = ({ onBack }) => (
  <div>
    <PageNavigation 
      title="页面标题" 
      icon="📝" 
      onBackClick={onBack}
    />
    {/* 页面内容 */}
  </div>
);
```

*   **统一风格**: 返回按钮统一为图标样式（无文字），悬浮有彩色交互效果。
*   **交互**: 确保 `onBack` 回调被正确传递和处理。

### 2. 服务调用

数据获取应通过 `src/app/services` 中的服务类进行，避免在组件中直接编写数据获取逻辑。

*   使用 `growthService` 获取成长数据。
*   使用 `contentService` 获取内容数据。
*   使用 `apiClient` 构建新的 API 请求。

### 3. 样式指南

*   使用 Tailwind CSS 进行样式开发。
*   保持配色方案统一：
    *   主色调：Purple/Pink/Blue 渐变
    *   功能色：Green (成长/完成), Orange (文化/探索)

### 4. 新增页面流程

1.  在 `src/app/components/pages/` 下创建新的页面组件。
2.  在 `src/app/App.tsx` 中注册新的路由状态。
3.  在 `GlobalNavigation` 或其他页面中添加跳转入口。

## 导出与部署

本项目为静态 Web 应用，构建后可直接部署。

*   **构建**: `npm run build`
*   **预览**: `npm run preview`
