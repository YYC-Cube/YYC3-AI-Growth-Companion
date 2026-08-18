# 测试和 CI/CD 配置

## 📋 概述

本文档说明了如何运行测试、查看覆盖率报告，以及配置 CI/CD 自动化测试。

---

## 🧪 运行测试

### 基本测试运行

```bash
bun test
```

### 带覆盖率的测试运行

```bash
bun run test:coverage
```

### 监视模式测试运行

```bash
bun run test:watch
```

### CI/CD 模式测试运行

```bash
bun run test:ci
```

---

## 📊 覆盖率报告

### 生成覆盖率报告

```bash
bun run test:coverage
```

### 查看 HTML 覆盖率报告

覆盖率报告将生成在 `coverage/html/index.html`。

### 查看覆盖率阈值

覆盖率阈值在 `bun.config.coverage.ts` 中配置：

```typescript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

---

## 🚀 预提交检查

### 运行预提交检查

```bash
bun run pre-commit
```

预提交检查包括：
- 运行测试
- 运行 lint
- 运行类型检查

如果任何检查失败，提交将被阻止。

---

## 🔄 CI/CD 配置

### GitHub Actions 工作流

CI/CD 配置文件位于 `.github/workflows/ci-cd.yml`。

工作流包括：
1. **测试** - 运行测试套件
2. **Lint** - 运行 lint 和类型检查
3. **构建** - 构建项目
4. **部署** - 部署到生产环境（仅 main 分支）

### 触发 CI/CD

CI/CD 在以下情况下触发：
- 推送到 `main` 或 `develop` 分支
- 针对 `main` 或 `develop` 分支的 Pull Request

---

## 📁 测试文件结构

```
__tests__/
├── hooks/
│   ├── useAIChat-logic.test.ts
│   ├── useGrowthRecords-logic.test.ts
│   └── useAccessibility-logic.test.ts
├── components/
│   └── common/
│       └── LanguageSwitcher-logic.test.ts
├── utils/
│   ├── date-formatting.test.ts
│   ├── formatDate.test.ts
│   └── debounce.test.ts
└── lib/
    ├── logger.test.ts
    ├── localstorage-safe.test.ts
    ├── utils.test.ts
    ├── speech.test.ts
    ├── performance.test.ts
    ├── client-logger.test.ts
    ├── ai-roles.test.ts
    ├── growth-stages.test.ts
    ├── assessment-questions.test.ts
    ├── resource-loader.test.ts
    ├── ai/
    │   └── emotion-monitor.test.ts
    ├── animation-system.test.ts
    ├── multimodal-fusion.test.ts
    └── utils/
        └── type-guards.test.ts
```

---

## 🎯 测试统计

### 当前测试状态

- **总测试数**：267
- **通过**：267（100%）
- **失败**：0（0%）
- **错误**：0（0%）

### 测试覆盖率

- **分支覆盖率**：80%+
- **函数覆盖率**：80%+
- **行覆盖率**：80%+
- **语句覆盖率**：80%+

---

## 🔧 配置文件

### Bun 测试配置

- `bun.config.test.ts` - 基本测试配置
- `bun.config.coverage.ts` - 覆盖率配置

### CI/CD 配置

- `.github/workflows/ci-cd.yml` - GitHub Actions 工作流

### 脚本

- `scripts/test-coverage.sh` - 测试覆盖率报告脚本
- `scripts/pre-commit.sh` - 预提交钩子脚本

---

## 📝 最佳实践

### 1. 编写测试

- 为每个新功能编写测试
- 确保测试独立且可重复运行
- 使用描述性的测试名称

### 2. 保持高覆盖率

- 目标是保持 80% 以上的覆盖率
- 优先测试关键功能和业务逻辑
- 定期审查和更新测试

### 3. 使用预提交检查

- 始终在提交前运行预提交检查
- 修复所有 lint 和类型错误
- 确保所有测试都通过

### 4. 自动化测试

- 依赖 CI/CD 自动运行测试
- 配置 PR 上的自动测试
- 监控测试结果并及时修复问题

---

## 🐛 调试测试

### 运行特定测试文件

```bash
bun test __tests__/hooks/useAIChat-logic.test.ts
```

### 运行特定测试用例

```bash
bun test -t "应该能够创建新会话"
```

### 查看详细输出

```bash
bun test --verbose
```

---

## 📚 参考文档

- [Bun Testing Documentation](https://bun.sh/docs/test)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Testing Library Documentation](https://testing-library.com/)

---

**最后更新**：2026-01-03
