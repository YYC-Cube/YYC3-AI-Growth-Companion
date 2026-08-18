# API 参考（API Reference）

> 对齐实况：2026-08-19 · 15 个路由
> 基础地址：开发/生产 `http://localhost:3201`（部署后为实际域名）

## 通用约定

- 响应格式：`{ "data": ..., "success": true }` 或 `{ "error": "中文错误信息", "success": false }`
- 错误码：400 参数/外键违规 · 404 不存在 · 413 载荷超限 · 500 服务端错误
- `/api/*` 由 middleware 统一附加 `Cache-Control: no-store`

## 目录

| 分组 | 路由 |
|---|---|
| AI 代理 | chat · homework-correction · speech-to-text · text-to-speech |
| AI 创意 | orchestrate · continue-story · assessment-report · analyze-record · emotion · enhanced-emotion · generate-image |
| 业务 CRUD | children · growth-records · homework(/:id) |
| 勋章 | badges |
| 可观测 | metrics |

---

## AI 代理（密钥不出服务端）

### POST /api/ai/chat

AI 对话（真实模型优先，未配密钥自动降级）。

**请求**：`{ "message": "string（必填）", "role?": "AIRole", "complexity?": "string" }`

**响应**：SSE 流（`text/event-stream`）
```
data: {"content":"逐段累积文本","role":"advisor","complexity":...}
...
data: [DONE]
```

角色枚举：`companion | recorder | listener | advisor | guardian | cultural`（未传时按内容自动选择）。
监控：`yyc3_ai_chat_requests_total{role,source=openai|gateway|mock}`。

### POST /api/ai/homework-correction

作业图片批改（BigModel 视觉）。

**请求**：`{ "image": "data:image/*;base64,..." }`（≤10MB）
**响应**：`{ "results": [{ "uuid","question","correct_answer","user_answer","is_correct","explanation","score?" }] }`

### POST /api/ai/speech-to-text

语音转写（multipart/form-data，字段 `audio`，≤25MB）。响应 `{ "text": "..." }`。

### POST /api/ai/text-to-speech

语音合成（CogTTS）。请求 `{ "text"（≤2000 字）, "voice?" }`
（白名单：tongtong/chuichui/xiaochen/jam/kazi/douji/luodo）。响应 `audio/*` 二进制流。

---

## AI 创意

### POST /api/ai/orchestrate

多角色协同响应（复杂度分档）。请求 `{ "message" }`；响应含主回复 + 角色洞察 + 行动建议。

### POST /api/ai/continue-story

故事续写选项。请求 `{ "previousContent?", "userInput?", "style?", "keywords?" }`；
失败降级为模板选项。

### POST /api/ai/assessment-report

成长评估报告生成。请求评分数据；响应含维度分析（失败返回 500 + 中文提示）。

### POST /api/ai/analyze-record

成长记录分析（本地分析引擎，无外部调用）。

### POST /api/ai/emotion · /api/ai/enhanced-emotion

情感分析（中文情感词典 / 增强引擎）。

### POST /api/ai/generate-image

创意生图（fal.ai Flux + 儿童安全词过滤；无 FAL_KEY 返回占位 SVG）。
请求 `{ "prompt", "style?" }`。

---

## 业务 CRUD（SQLite 持久化）

### /api/children

| 方法 | 说明 |
|---|---|
| GET | 列出全部儿童档案 |
| POST | 新增。必填 `name`、`birth_date`；`user_id` 须为已存在用户（外键），否则 400 |

### /api/growth-records

GET（支持 `?child_id=` 过滤）/ POST。字段：`child_id`、`type(milestone|observation|emotion|learning)`、`title`、`content`、`media_urls[]`、`tags[]` 等（JSON 列自动序列化）。

### /api/homework · /api/homework/[id]

作业任务 CRUD（GET/POST/PUT/DELETE）。

> 首次访问任一业务 API 自动建表并灌入种子数据（示例家庭/作业/课程）。

---

## 勋章

### GET /api/badges

| 查询参数 | 行为 |
|---|---|
| `id=<badgeId>` | 单枚详情（404 不存在） |
| `action=search&q=关键词` | 标题/描述/标签搜索 |
| `series=` / `category=` | 套系/分类筛选 |
| `action=earned` / `hidden` | 已获得 / 隐藏勋章 |
| `action=stats` | 统计（total/earned/bySeries/byRarity/totalPoints…） |
| `action=groups` | 套系分组（含进度） |
| `action=progress&series=` | 套系进度 |
| （无参数） | 全部勋章 |

### POST /api/ai/badges → /api/badges

`{ "action": "unlock", "id": "badgeId" }`——解锁勋章（进度达 100 才成功）。

---

## 可观测

### GET /api/metrics

Prometheus 文本格式。默认指标（CPU/内存/事件循环）+ 业务计数器：

```
yyc3_ai_chat_requests_total{role,source}
yyc3_badges_requests_total{action}
yyc3_badges_unlocked_total
```

---

## 调用示例

```bash
# AI 对话（流式，取首段）
curl -N -X POST http://localhost:3201/api/ai/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"孩子三岁不爱吃饭怎么办"}'

# 新增儿童档案
SEED_UID=$(curl -s localhost:3201/api/children | python3 -c "import json,sys;print(json.load(sys.stdin)['data'][0]['user_id'])")
curl -X POST localhost:3201/api/children -H 'Content-Type: application/json' \
  -d "{\"user_id\":\"$SEED_UID\",\"name\":\"二宝\",\"birth_date\":\"2024-03-01\",\"gender\":\"male\"}"

# 勋章统计
curl -s 'localhost:3201/api/badges?action=stats'
```
