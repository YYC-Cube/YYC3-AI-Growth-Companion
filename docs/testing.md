# 测试指南（Testing Guide）

> 对齐实况：2026-08-19 · 基线 **497 通过 / 0 失败 / 34 文件 / ~4s**

## 1. 快速开始

```bash
bun test                     # 全量（~4s）
bun test __tests__/lib/      # 按目录
bun test __tests__/badgeService.test.ts   # 单文件
```

无 jsdom 预加载、无全局 setup——每个测试文件自含所需 mock。

## 2. 编写规范

### 2.1 模板

```ts
import { describe, it, expect } from 'bun:test';
import { myFn } from '../../lib/my-module';

describe('myModule', () => {
  it('应该在 xxx 时返回 yyy', () => {
    expect(myFn(input)).toBe(output);
  });
});
```

### 2.2 规则（红线）

1. **导入一律 `bun:test`**（jest 风格 `@jest/globals` 在 bun 下不可用——4 个
   `.disabled` 文件的教训）
2. **源码内相对路径、别名谨慎**：`src/` 内引用 `@/` 在 CI 端 bun 版本解析不一致，
   涉及测试加载的模块用相对导入（badgeService 案例）
3. **SSR 安全**：被服务端加载的模块读写 localStorage 必须 `typeof` 守卫
   （badgeService 的 `loadStoredProgress` 模式）
4. **异步断言必须 await**：未 await 的 Promise 竞态会造成间歇性失败
5. **禁止提交挂起测试**：未决异步/泄漏定时器会卡死整个套件（历史上导致
   `bun test` 永不返回）；无法立即修复时改名 `.disabled` 并在提交信息说明

### 2.3 环境边界

bun:test 默认**无** DOM/navigator/localStorage。需要时：

- 纯逻辑抽离：把可测逻辑拆成 `-logic.test.ts`（仓库既有模式，hooks 类推荐）
- 局部 mock：文件内 `global.localStorage = {...} as any`
- 真要 DOM：`.disabled` + 后续迁移（当前无 jsdom 基建，谨慎引入）

## 3. 覆盖地图（34 个文件分布）

| 域 | 文件示例 | 数量 |
|---|---|---|
| 徽章 | badgeService（35 用例）、LanguageSwitcher-logic | 2 |
| AI/模型 | model-provider、ai-roles、ai-command-parser、emotion-monitor | 4+ |
| 数据层 | db/database-manager | 1 |
| Hooks 逻辑 | useAIChat/useAccessibility/useGrowthRecords-logic | 3 |
| i18n | i18n-core（内置模块冒烟） | 1 |
| 基础设施 | logger、client-logger、global-error-handler、character-manager（36） | 15+ |
| 工具 | utils/date-formatting、debounce、helpers | 4 |

`.disabled`（4，待迁移）：badgeComponents、mobility、rule-engine、decision-engine
——jest 时代写法（testing-library/jsdom 依赖），迁移时按 §2 重写。

## 4. CI 集成

`bun test` 是 CI **阻塞门禁**第一关（`.github/workflows/ci.yml`）：

- 任何用例回退 → PR 不可合并
- 冒烟 job 另行在生产模式实测八项路由（见 [deployment.md](deployment.md)）

## 5. 新功能测试清单（PR 自查）

- [ ] 新服务/工具函数有对应 `__tests__/` 用例（镜像源码路径）
- [ ] 触碰文件后全量 `bun test` 保持 497+ 且 0 fail
- [ ] 涉及降级路径（无密钥/网络失败）的分支有用例
- [ ] 无未 await 的异步断言；无泄漏定时器

## 6. 基线推进目标

| 阶段 | 目标 |
|---|---|
| 当前 | 497/0；4 个 .disabled 待迁移 |
| +徽章持久化 | badges CRUD 路由集成测试 |
| +i18n-core | 按 ICU/插件/检测分域补齐（上游 621 用例可参考精选） |
| 终态 | type-coverage ≥ 80%，覆盖率入 CI 报告 |
