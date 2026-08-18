# YYC³-XY-01 类型系统说明

**版本**: 2.0.0
**更新时间**: 2026-01-02

---

## 概述

YYC³-XY-01 项目采用统一的类型定义系统，所有类型定义集中在 `types/index.ts` 文件中，按功能模块分类组织。

---

## 类型组织结构

### 1. 基础类型 (Foundation)

```typescript
import type { BaseEntity, ApiResponse, PaginationParams, PaginatedResponse } from '@/types'
```

- `BaseEntity` - 基础实体接口（id, created_at, updated_at）
- `ApiResponse<T>` - API响应包装器
- `PaginationParams` - 分页参数
- `PaginatedResponse<T>` - 分页响应

### 2. 用户系统 (User System)

```typescript
import type { User, UserProfile, UserPreferences, Child, AgeGroup } from '@/types'
```

- `User` - 用户基础信息
- `UserProfile` - 用户详细资料
- `UserPreferences` - 用户偏好设置
- `Child` - 儿童信息
- `AgeGroup` - 年龄分组

### 3. 成长记录 (Growth System)

```typescript
import type { GrowthRecord, AgeStage, AgeStageConfig, DevelopmentDimension } from '@/types'
import type { Milestone, AIInsight } from '@/types'
```

- `GrowthRecord` - 成长记录
- `AgeStage` - 年龄阶段类型（0-3, 3-6, 6-9, 9-12, 12-15, 15-18, 18-22）
- `AgeStageConfig` - 年龄阶段配置
- `DevelopmentDimension` - 发展维度
- `Milestone` - 里程碑
- `AIInsight` - AI洞察

### 4. AI系统 (AI System)

```typescript
import type { AIMessage, AIContext, EmotionState, EmotionAnalysis } from '@/types'
import type { AIPersona, AITool, MultimodalContent, ModerationResult } from '@/types'
import type { AIPrediction, AIMessageMetadata } from '@/types'
```

- `AIMessage` - AI消息
- `AIContext` - AI上下文
- `EmotionState` - 情绪状态
- `EmotionAnalysis` - 情绪分析
- `AIPersona` - AI角色
- `AITool` - AI工具
- `MultimodalContent` - 多模态内容
- `ModerationResult` - 内容审核结果
- `AIPrediction` - AI预测

### 5. 课程系统 (Curriculum System)

```typescript
import type { Course, CourseSchedule, Semester, CurriculumCourse } from '@/types'
import type { CourseModule, CourseContent, Activity, Assessment } from '@/types'
import type { Question, EvaluationCriteria } from '@/types'
```

- `Course` - 课程信息
- `CourseSchedule` - 课程时间表
- `Semester` - 学期
- `CurriculumCourse` - 课程课程
- `CourseModule` - 课程模块
- `CourseContent` - 课程内容
- `Activity` - 活动
- `Assessment` - 评估
- `Question` - 问题
- `EvaluationCriteria` - 评估标准

### 6. 作业系统 (Homework System)

```typescript
import type { HomeworkTask, HomeworkSubmission, AIAssistance, AIEvaluation } from '@/types'
```

- `HomeworkTask` - 作业任务
- `HomeworkSubmission` - 作业提交
- `AIAssistance` - AI辅助
- `AIEvaluation` - AI评估

### 7. 勋章系统 (Badge System)

```typescript
import type { Badge, BadgeSeries, BadgeLevel, BadgeCategory, BadgeRarity } from '@/types'
import type { UnlockCondition, ShareContent, BadgeMetadata, SeriesProgress } from '@/types'
import type { BadgeGroup, BadgeStats, BadgeService } from '@/types'
```

**勋章套系 (BadgeSeries)**:
- `growth` - 成长勋章
- `creative` - 创意勋章
- `hidden` - 隐藏勋章
- `dynasty` - 朝代勋章
- `celebrities` - 名人勋章
- `technology` - 科技勋章
- `dream` - 筑梦勋章
- `culture` - 文化勋章
- `learning` - 学习勋章
- `social` - 社交勋章

**勋章等级 (BadgeLevel)**:
- `bronze` - 青铜
- `silver` - 白银
- `gold` - 黄金
- `platinum` - 白金
- `diamond` - 钻石
- `legend` - 传说

**勋章稀有度 (BadgeRarity)**:
- `common` - 普通
- `rare` - 稀有
- `epic` - 史诗
- `legendary` - 传说
- `mythical` - 神话

### 8. 附件系统 (Attachment System)

```typescript
import type { Attachment } from '@/types'
```

- `Attachment` - 附件信息

### 9. 语音系统 (Voice System)

```typescript
import type { VoiceInteraction, VoiceMetadata } from '@/types'
```

- `VoiceInteraction` - 语音交互
- `VoiceMetadata` - 语音元数据

### 10. 通知系统 (Notification System)

```typescript
import type { Notification } from '@/types'
```

- `Notification` - 通知

### 11. 数据分析 (Analytics)

```typescript
import type { Analytics, UsageStats } from '@/types'
```

- `Analytics` - 分析事件
- `UsageStats` - 使用统计

### 12. 系统配置 (System)

```typescript
import type { SystemConfig, ValidationRule, Permission, Role, AccessLog } from '@/types'
import type { AppError, ValidationError } from '@/types'
```

- `SystemConfig` - 系统配置
- `ValidationRule` - 验证规则
- `Permission` - 权限
- `Role` - 角色
- `AccessLog` - 访问日志
- `AppError` - 应用错误
- `ValidationError` - 验证错误

### 13. UI相关 (UI)

```typescript
import type { Theme, UIComponent } from '@/types'
import type { Message, AIRole } from '@/types'
```

- `Theme` - 主题
- `UIComponent` - UI组件
- `Message` - 消息
- `AIRole` - AI角色

---

## 类型依赖关系图

```
基础层 (无依赖)
├── BaseEntity, ApiResponse, PaginationParams
├── Message, AIRole
├── Theme, UIComponent
└── ValidationRule

用户层 (依赖基础层)
├── User, UserProfile, UserPreferences, AgeGroup
└── Child

成长层 (依赖基础层、用户层)
├── GrowthRecord, AgeStage, AgeStageConfig
├── DevelopmentDimension
├── Milestone
└── AIInsight

AI层 (依赖基础层)
├── AIMessage, AIContext
├── EmotionState, EmotionAnalysis
├── AIPersona, AITool
├── MultimodalContent, ModerationResult
├── AIPrediction
└── AIMessageMetadata

课程层 (依赖基础层)
├── Course, CourseSchedule, Semester
├── CurriculumCourse, CourseModule, CourseContent
├── Activity, Assessment, Question
└── EvaluationCriteria

作业层 (依赖基础层、AI层)
├── HomeworkTask, HomeworkSubmission
├── AIAssistance
└── AIEvaluation

勋章层 (无外部依赖)
├── Badge, BadgeSeries, BadgeLevel
├── BadgeCategory, BadgeRarity
├── UnlockCondition, ShareContent
├── BadgeMetadata, SeriesProgress
├── BadgeGroup, BadgeStats
└── BadgeService

附件层 (依赖基础层)
└── Attachment

语音层 (依赖基础层、用户层)
├── VoiceInteraction
└── VoiceMetadata

通知层 (依赖基础层、用户层)
└── Notification

分析层 (依赖基础层、用户层)
├── Analytics
└── UsageStats

系统层 (依赖基础层)
├── SystemConfig, Permission, Role
├── AccessLog
├── AppError
└── ValidationError
```

---

## 导入指南

### 单个类型导入

```typescript
import type { User } from '@/types'

const user: User = {
  id: '123',
  email: 'user@example.com',
  // ...
}
```

### 多个类型导入

```typescript
import type { User, UserProfile, Child } from '@/types'
```

### 使用类型别名

```typescript
import type { BadgeSeries, BadgeLevel } from '@/types'

type MyBadge = {
  series: BadgeSeries
  level: BadgeLevel
}
```

### 导入服务接口

```typescript
import type { BadgeService } from '@/types'

class MyBadgeService implements BadgeService {
  // ...
}
```

---

## 最佳实践

### 1. 使用 `import type` 进行类型导入

```typescript
// ✅ 推荐
import type { User } from '@/types'

// ❌ 避免
import { User } from '@/types'
```

### 2. 统一使用 `@/types` 别名

```typescript
// ✅ 推荐
import type { Badge } from '@/types'

// ❌ 避免
import type { Badge } from '@/types/badge'
import type { Badge } from '../types/badge'
```

### 3. 避免循环依赖

- 确保类型定义不形成循环引用
- 使用类型注解而非接口继承来打破循环

### 4. 保持类型命名一致

- 接口使用 PascalCase: `UserProfile`, `GrowthRecord`
- 类型别名使用 PascalCase: `BadgeSeries`, `BadgeLevel`
- 常量使用 UPPER_SNAKE_CASE: `SUBJECT_COLORS`

---

## 类型文件维护

### 添加新类型

1. 在 `types/index.ts` 中找到对应的分类区域
2. 添加新类型定义
3. 更新文档说明

### 修改现有类型

1. 检查类型被引用的位置
2. 更新类型定义
3. 确保向后兼容或提供迁移指南

### 删除类型

1. 确认类型不再被使用
2. 从 `types/index.ts` 中移除
3. 更新文档

---

## 类型目录

项目保留以下类型子目录以支持特定模块的组织：

```
types/
├── api/          # API相关类型
│   └── common.ts
├── gateway/      # API网关类型
│   └── common.ts
├── goals/        # 目标管理类型
│   └── common.ts
├── knowledge/    # 知识图谱类型
│   └── common.ts
├── learning/     # 学习系统类型
│   └── common.ts
├── orchestrator/ # 服务编排类型
│   └── common.ts
├── prediction/   # 预测系统类型
│   └── common.ts
└── tools/        # 工具类型
    └── common.ts
```

这些子目录中的类型可以通过 `@/types/xxx/common` 导入，未来可以逐步整合到主 `types/index.ts` 文件中。

---

## 外部类型导出

```typescript
// Next.js 类型
export type { NextRequest, NextResponse } from 'next/server'
export type { NextPage, Metadata } from 'next'

// React 类型
export type {
  ComponentType,
  FC,
  PropsWithChildren,
  ReactNode,
  ReactElement,
  CSSProperties,
} from 'react'
```

这些类型可以直接从 `@/types` 导入：

```typescript
import type { NextRequest, NextResponse } from '@/types'
import type { FC, ReactNode } from '@/types'
```

---

## 总结

YYC³-XY-01 的类型系统通过统一的 `types/index.ts` 文件，提供了：

- ✅ **集中管理**: 所有类型定义在一个文件中
- ✅ **清晰分类**: 按功能模块组织
- ✅ **易于查找**: 通过注释和分组快速定位
- ✅ **依赖明确**: 清晰的依赖关系图
- ✅ **统一导入**: 使用 `@/types` 别名

**推荐使用方式**:
```typescript
import type { User, Badge, GrowthRecord, AIMessage } from '@/types'
```
