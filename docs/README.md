# 项目文档索引

> YYC³ AI小语 · 智能成长守护系统（统一基线 v3.2.x）· 更新：2026-08-19

## 📚 活跃文档（日常使用，随代码更新）

| 文档 | 用途 |
|---|---|
| [开发者指南](developer-guide.md) | **入口文档**：环境、命令、密钥、模块地图、坑表 |
| [架构设计](architecture.md) | 四层架构、选型理由、关键链路、ADR |
| [API 参考](api-reference.md) | 15 个路由的请求/响应/示例 |
| [部署指南](deployment.md) | Pages(xy.yyc3.vip) + 主应用 SSR 部署 + 运维手册 |
| [测试指南](testing.md) | 编写规范、覆盖地图、CI 集成 |
| [根目录 README](../README.md) | 项目门面：能力总览 + 可视化架构 |
| [CONTRIBUTING](../CONTRIBUTING.md) · [SECURITY](../SECURITY.md) · [CHANGELOG](../CHANGELOG.md) | 社区标准文件 |

## 📐 规范（docs/standards/）

| 规范 | 适用 |
|---|---|
| [TYPE-SAFETY-BEST-PRACTICES](standards/TYPE-SAFETY-BEST-PRACTICES.md) | TypeScript 类型安全 |
| [UI-Consistency-Guidelines](standards/UI-Consistency-Guidelines.md) | UI 一致性 |
| [TYPOGRAPHY-GUIDE](standards/TYPOGRAPHY-GUIDE.md) | 排版 |
| [CARD-STYLES-GUIDE](standards/CARD-STYLES-GUIDE.md) | 卡片样式 |
| [ESLINT-CUSTOM-RULES](standards/ESLINT-CUSTOM-RULES.md) | 自定义 lint 规则 |

## 🗄 历史档案（只读，不再更新）

以下为合并过程中的历史资产，仅供追溯，**内容可能与现状不符，以活跃文档为准**：

| 目录 | 内容 |
|---|---|
| `12-归档文档/` | 旧版本归档：docs-original 家族文档库、code-quality 报告、过程报告（process-reports/）、三轮合并执行报告（MERGE_EXECUTION_REPORT.md） |
| `13-Baby并入文档/` | YYC3-Baby 吸收的架构/规划/历史快照文档 |
| `01-项目规范` ~ `11-脚本工具` | 编号目录为家族各版本历史文档（规范/架构/计划/总结/审核等，共 4000+ 篇），整体视为档案 |

## 🧭 文档维护规则

1. **新内容进活跃文档**；过程性报告一律进 `12-归档文档/process-reports/`
2. 代码 PR 涉及架构/API/部署变更时，同步更新对应活跃文档（CONTRIBUTING 要求）
3. 历史档案目录不新增、不修改（git 历史可追溯）
