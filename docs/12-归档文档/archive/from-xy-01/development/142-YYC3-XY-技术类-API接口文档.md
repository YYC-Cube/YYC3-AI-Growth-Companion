# YYC3 AI小语智能成长守护系统 - API接口文档

> 版本: v1.0 | 基础路径: /api

---

## 一、接口概览

| 模块 | 接口数 | 说明 |
|------|--------|------|
| AI服务 | 5 | AI对话、情感分析、评估报告 |
| 儿童档案 | 1 | 儿童CRUD操作 |
| 成长记录 | 1 | 成长记录CRUD操作 |
| 作业管理 | 2 | 作业列表和状态更新 |

---

## 二、AI服务接口

### 2.1 AI对话

**POST** `/api/ai/chat`

请求体:
\`\`\`json
{
  "messages": [
    { "role": "user", "content": "你好" }
  ],
  "roleId": "guardian",
  "childContext": {
    "name": "小明",
    "age": 5,
    "stage": "3-6岁"
  }
}
\`\`\`

响应: 流式文本响应

### 2.2 情感分析

**POST** `/api/ai/emotion`

请求体:
\`\`\`json
{
  "text": "今天宝宝很开心"
}
\`\`\`

响应:
\`\`\`json
{
  "emotion": "happy",
  "confidence": 0.85,
  "valence": 0.8,
  "arousal": 0.6,
  "suggestions": ["继续保持积极的互动"]
}
\`\`\`

### 2.3 角色协同

**POST** `/api/ai/orchestrate`

请求体:
\`\`\`json
{
  "query": "孩子3岁语言发展慢怎么办",
  "childAge": 36
}
\`\`\`

响应:
\`\`\`json
{
  "isComplex": true,
  "responses": [
    { "roleId": "guardian", "content": "..." },
    { "roleId": "advisor", "content": "..." }
  ],
  "synthesis": "综合建议..."
}
\`\`\`

### 2.4 评估报告生成

**POST** `/api/ai/assessment-report`

请求体:
\`\`\`json
{
  "childName": "小明",
  "childAge": 60,
  "stageId": "stage_3_6",
  "scores": {
    "cognitive": 85,
    "language": 78,
    "motor": 90
  }
}
\`\`\`

响应:
\`\`\`json
{
  "summary": "总体评估...",
  "strengths": ["运动能力突出"],
  "improvements": ["语言表达可加强"],
  "recommendations": ["建议每天亲子阅读20分钟"]
}
\`\`\`

### 2.5 成长记录分析

**POST** `/api/ai/analyze-record`

请求体:
\`\`\`json
{
  "content": "今天宝宝第一次自己穿鞋",
  "recordType": "milestone"
}
\`\`\`

响应:
\`\`\`json
{
  "suggestedTitle": "第一次独立穿鞋",
  "suggestedTags": ["自理能力", "里程碑", "精细运动"],
  "isMilestone": true,
  "milestoneType": "self_care",
  "aiInsight": "这是孩子自理能力发展的重要里程碑..."
}
\`\`\`

---

## 三、儿童档案接口

### 3.1 儿童档案CRUD

**GET** `/api/children`

响应:
\`\`\`json
{
  "children": [
    {
      "id": "uuid",
      "name": "小明",
      "nickname": "明明",
      "birthDate": "2020-01-01",
      "gender": "male",
      "avatar": "/avatars/1.png"
    }
  ]
}
\`\`\`

**POST** `/api/children`

请求体:
\`\`\`json
{
  "name": "小明",
  "nickname": "明明",
  "birthDate": "2020-01-01",
  "gender": "male"
}
\`\`\`

**PUT** `/api/children?id=uuid`

**DELETE** `/api/children?id=uuid`

---

## 四、成长记录接口

### 4.1 成长记录CRUD

**GET** `/api/growth-records?childId=uuid`

**POST** `/api/growth-records`

请求体:
\`\`\`json
{
  "childId": "uuid",
  "recordType": "milestone",
  "title": "第一次走路",
  "content": "宝宝今天迈出了人生第一步...",
  "mediaUrls": ["https://..."],
  "tags": ["里程碑", "运动发展"]
}
\`\`\`

---

## 五、作业管理接口

### 5.1 作业列表

**GET** `/api/homework?childId=uuid`

响应:
\`\`\`json
{
  "homework": [
    {
      "id": "uuid",
      "subject": "语文",
      "title": "古诗背诵",
      "dueDate": "2024-12-20",
      "status": "pending",
      "priority": "high"
    }
  ]
}
\`\`\`

### 5.2 更新作业状态

**PUT** `/api/homework/[id]`

请求体:
\`\`\`json
{
  "status": "completed"
}
\`\`\`

---

## 六、错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 七、请求限制

| 接口类型 | 限制 |
|----------|------|
| AI对话 | 60次/分钟 |
| 其他接口 | 100次/分钟 |

---
