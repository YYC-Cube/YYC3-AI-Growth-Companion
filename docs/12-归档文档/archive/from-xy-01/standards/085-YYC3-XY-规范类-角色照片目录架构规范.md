---
@file: 085-YYC3-XY-规范类-角色照片目录架构规范.md
@description: YYC3-XY项目规范类角色照片目录架构规范文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-28
@updated: 2025-12-28
@status: published
@tags: 规范文档,标准指南,合规要求
---

# YYC³角色照片目录架构说明文档

## 1. 目录结构概述

本文档描述了 `/Users/yanyu/yyc3-xy-ai/public/role_photos` 目录的架构优化方案，旨在提升目录结构的规范性、可读性和可维护性，符合YYC³团队标准化规范。

## 2. 优化前目录结构

```
role_photos/
├── joint_avatars/
│   ├── xiaoyan_boy_xiaoyu_girl_cute_001_joint_avatar.png
│   ├── xiaoyan_boy_xiaoyu_girl_cute_002_joint_avatar.png
│   └── xiaoyan_boy_xiaoyu_girl_cute_003_joint_avatar.png
├── role_boy/
│   ├── ai_role_avatars/
│   │   ├── ai_avatars_boy_xiaoyan_casual_001.png
│   │   ├── ai_avatars_boy_xiaoyan_casual_002.png
│   │   ├── ai_avatars_boy_xiaoyan_casual_003.png
│   │   ├── ai_avatars_boy_xiaoyan_cool_001.png
│   │   └── ai_avatars_boy_xiaoyan_cool_002.png
│   ├── role_boy_xiaoyan_casual_001.png
│   ├── role_boy_xiaoyan_casual_002.png
│   ├── role_boy_xiaoyan_casual_003.png
│   ├── role_boy_xiaoyan_casual_005.png
│   ├── role_boy_xiaoyan_cool_001.png
│   ├── role_boy_xiaoyan_cool_002.png
│   ├── role_boy_xiaoyan_cool_003.png
│   ├── role_boy_xiaoyan_formal_001.png
│   ├── role_boy_xiaoyan_formal_002.png
│   ├── role_boy_xiaoyan_formal_003.png
│   ├── role_boy_xiaoyan_formal_005.png
│   ├── role_boy_xiaoyan_formal_006.png
│   ├── role_boy_xiaoyan_formal_007.png
│   ├── role_boy_xiaoyan_formal_008.png
│   └── role_boy_xiaoyan_formal_009.png
└── role_girl/
    ├── ai_role_avatars/
    │   ├── ai_avatars_girl_xiaoyu_lolita_blue_001.png
    │   ├── ai_avatars_girl_xiaoyu_lolita_blue_002.png
    │   ├── ai_avatars_girl_xiaoyu_lolita_pink_001.png
    │   └── ai_avatars_girl_xiaoyu_lolita_pink_002.png
    ├── role_girl_xiaoyu_lolita_blue_008.png
    ├── role_girl_xiaoyu_lolita_blue_009.png
    ├── role_girl_xiaoyu_lolita_blue_010.png
    ├── role_girl_xiaoyu_lolita_blue_011.png
    ├── role_girl_xiaoyu_lolita_blue_013.png
    ├── role_girl_xiaoyu_lolita_pink_001.png
    ├── role_girl_xiaoyu_lolita_pink_002.png
    ├── role_girl_xiaoyu_lolita_pink_003.png
    ├── role_girl_xiaoyu_lolita_pink_005.png
    ├── role_girl_xiaoyu_lolita_pink_006.png
    ├── role_girl_xiaoyu_school_blue_015.png
    ├── role_girl_xiaoyu_school_blue_016.png
    └── role_girl_xiaoyu_school_pink_007.png
```

## 3. 优化后目录结构

```
role-photos/
├── joint-avatars/
│   ├── xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png
│   ├── xiaoyan-boy-xiaoyu-girl-cute-002-joint-avatar.png
│   └── xiaoyan-boy-xiaoyu-girl-cute-003-joint-avatar.png
├── boy/
│   ├── ai-avatars/
│   │   └── [AI头像文件]
│   ├── xiaoyan-casual-001.png
│   ├── xiaoyan-casual-002.png
│   ├── xiaoyan-casual-003.png
│   ├── xiaoyan-casual-005.png
│   ├── xiaoyan-cool-001.png
│   ├── xiaoyan-cool-002.png
│   ├── xiaoyan-cool-003.png
│   ├── xiaoyan-formal-001.png
│   ├── xiaoyan-formal-002.png
│   ├── xiaoyan-formal-003.png
│   ├── xiaoyan-formal-005.png
│   ├── xiaoyan-formal-006.png
│   ├── xiaoyan-formal-007.png
│   ├── xiaoyan-formal-008.png
│   └── xiaoyan-formal-009.png
└── girl/
    ├── ai-avatars/
    │   └── [AI头像文件]
    ├── xiaoyu-lolita-blue-008.png
    ├── xiaoyu-lolita-blue-009.png
    ├── xiaoyu-lolita-blue-010.png
    ├── xiaoyu-lolita-blue-011.png
    ├── xiaoyu-lolita-blue-013.png
    ├── xiaoyu-lolita-pink-001.png
    ├── xiaoyu-lolita-pink-002.png
    ├── xiaoyu-lolita-pink-003.png
    ├── xiaoyu-lolita-pink-005.png
    ├── xiaoyu-lolita-pink-006.png
    ├── xiaoyu-school-blue-015.png
    ├── xiaoyu-school-blue-016.png
    └── xiaoyu-school-pink-007.png
```

## 4. 优化说明

### 4.1 目录命名优化

| 优化前 | 优化后 | 优化原因 |
|--------|--------|----------|
| `role_photos` | `role-photos` | 使用kebab-case格式，符合YYC³命名规范 |
| `joint_avatars` | `joint-avatars` | 使用kebab-case格式，符合YYC³命名规范 |
| `role_boy` | `boy` | 简化目录名，保持语义清晰，符合YYC³简洁性原则 |
| `role_girl` | `girl` | 简化目录名，保持语义清晰，符合YYC³简洁性原则 |
| `ai_role_avatars` | `ai-avatars` | 使用kebab-case格式，简化命名，保持一致性 |

### 4.2 文件命名优化

| 优化前 | 优化后 | 优化原因 |
|--------|--------|----------|
| `xiaoyan_boy_xiaoyu_girl_cute_001_joint_avatar.png` | `xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png` | 使用kebab-case格式，保持命名一致性 |
| `ai_avatars_boy_xiaoyan_casual_001.png` | `[AI头像文件]` | 移除冗余前缀，保持命名简洁性和一致性 |
| `role_boy_xiaoyan_casual_001.png` | `xiaoyan-casual-001.png` | 移除冗余前缀，保持命名简洁性和一致性 |
| `role_girl_xiaoyu_lolita_blue_008.png` | `xiaoyu-lolita-blue-008.png` | 移除冗余前缀，保持命名简洁性和一致性 |

### 4.3 命名规范

1. **目录命名**：
   - 使用kebab-case格式（单词间用短横线连接）
   - 保持简洁性，避免冗余词汇
   - 语义清晰，便于理解和维护

2. **文件命名**：
   - 使用kebab-case格式
   - 遵循以下命名模式：`[角色名]-[风格]-[编号].png`
   - 联合头像：`[角色名1]-[性别1]-[角色名2]-[性别2]-[风格]-[编号]-joint-avatar.png`
   - 移除冗余前缀和重复词汇
   - 保持编号格式一致性（三位数字）

## 5. 角色信息

### 5.1 小语 (xiaoyu)

- **姓名**: 小语 (xiaoyu)
- **性别**: 女
- **生日**:
  - 农历: 十一月初十
  - 阳历: 2024年12月10日
- **星座**: ♐ 射手座
- **年龄**: 1岁

### 5.2 小言 (xiaoyan)

- **姓名**: 小言 (xiaoyan)
- **性别**: 男
- **生日**:
  - 农历: 八月十九
  - 阳历: 2015年10月1日
- **星座**: ♎ 天秤座
- **年龄**: 10岁

## 6. 目录功能说明

### 6.1 `role-photos/`

角色照片主目录，存放所有角色相关的图片资源。

### 6.2 `joint-avatars/`

存放男孩和女孩角色的联合头像。

### 6.3 `boy/`

存放男孩角色的所有照片资源。

### 6.4 `boy/ai-avatars/`

存放男孩角色的AI生成头像。

### 6.5 `girl/`

存放女孩角色的所有照片资源。

### 6.6 `girl/ai-avatars/`

存放女孩角色的AI生成头像。

## 7. 使用指南

### 7.1 资源引用

在代码中引用图片资源时，建议使用以下方式：

```javascript
// 引用男孩角色的休闲风格头像
const casualAvatar = '/role-photos/boy/xiaoyan-casual-001.png';

// 引用女孩角色的萝莉风格头像
const lolitaAvatar = '/role-photos/girl/xiaoyu-lolita-blue-008.png';

// 引用联合头像
const jointAvatar = '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png';
```

**注意**：

1. 不需要包含 `/public/` 前缀，Next.js 会自动处理
2. 确保路径大小写和格式与实际文件一致

### 7.2 资源管理

- 新增角色照片时，请遵循命名规范
- 定期清理过期或不再使用的图片资源
- 保持目录结构的一致性和完整性

## 8. 合规性检查

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 目录命名规范 | ✅ 合规 | 使用kebab-case格式 |
| 文件命名规范 | ✅ 合规 | 使用kebab-case格式，命名清晰 |
| 目录结构清晰性 | ✅ 合规 | 层次分明，便于管理 |
| 语义一致性 | ✅ 合规 | 命名与内容一致，易于理解 |
| 可维护性 | ✅ 合规 | 结构简洁，便于扩展和维护 |

## 9. 版本历史

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2025-01-30 | 初始文档创建，目录结构优化说明 | YYC³团队 |
| 1.1.0 | 2025-01-30 | 添加角色详细信息 | YYC³团队 |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>

