# API接口文档

## 📋 概述

本文档描述小语智能成长守护系统的所有API接口。

**Base URL**: `http://localhost:3000/api`

**认证方式**: JWT Bearer Token

---

## 🔐 认证相关

### 用户注册
```http
POST /api/user/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**响应**:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

### 用户登录
```http
POST /api/user/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "username": "string"
  }
}
```

---

## 📝 成长记录

### 获取记录列表
```http
GET /api/records?userId={userId}&page={page}&limit={limit}
Authorization: Bearer {token}
```

**查询参数**:
- `userId`: 用户ID
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "record_id",
      "userId": "user_id",
      "title": "string",
      "content": "string",
      "occurredAt": "2024-01-01T00:00:00.000Z",
      "type": "event",
      "emotion": "happy",
      "tags": ["tag1", "tag2"]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 创建记录
```http
POST /api/records
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "title": "string",
  "content": "string",
  "type": "event",
  "emotion": "happy",
  "tags": ["tag1"]
}
```

---

## 🏆 里程碑管理

### 获取里程碑列表
```http
GET /api/milestones?userId={userId}&isAchieved={boolean}
Authorization: Bearer {token}
```

**响应**:
```json
{
  "success": true,
  "milestones": [
    {
      "_id": "milestone_id",
      "userId": "user_id",
      "category": "physical",
      "title": "第一次独立行走",
      "description": "string",
      "isAchieved": true,
      "achievedDate": "2024-01-01",
      "evidence": "string"
    }
  ]
}
```

### 标记里程碑为已达成
```http
POST /api/milestones/{id}/achieve
Authorization: Bearer {token}
Content-Type: application/json

{
  "achievedDate": "2024-01-01",
  "evidence": "string"
}
```

---

## 🤖 AI智能体

### 智能体对话
```http
POST /api/agents/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "agentType": "companion",
  "message": "string",
  "context": {
    "userId": "user_id",
    "childName": "string"
  }
}
```

**agentType可选值**:
- `companion`: 陪伴者
- `recorder`: 记录者
- `listener`: 聆听者
- `advisor`: 建议者
- `guardian`: 守护者

**响应**:
```json
{
  "success": true,
  "data": {
    "response": "string",
    "metadata": {
      "agentType": "companion",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🔍 RAG知识检索

### 标准查询
```http
POST /api/rag/query
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "string",
  "userId": "user_id"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "answer": "string",
    "sources": [
      {
        "title": "string",
        "content": "string",
        "relevance": 0.95
      }
    ],
    "confidence": 0.85
  }
}
```

### 流式查询
```http
POST /api/rag/query-stream
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "string",
  "userId": "user_id"
}
```

**响应**: Server-Sent Events (SSE)

### 反馈提交
```http
POST /api/rag/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "string",
  "answer": "string",
  "rating": 5,
  "helpful": true,
  "feedback": "string"
}
```

### 获取FAQ
```http
GET /api/rag/faq?limit={limit}
Authorization: Bearer {token}
```

---

## 📊 AI分析

### 成长分析
```http
POST /api/ai/analyze-growth
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "childId": "child_id",
  "timeRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "pattern",
        "title": "string",
        "description": "string",
        "confidence": 0.85
      }
    ],
    "recommendations": [
      {
        "priority": "high",
        "category": "physical",
        "suggestion": "string",
        "rationale": "string"
      }
    ],
    "summary": "string"
  }
}
```

---

## 🎯 成长预测

### 发展轨迹预测
```http
POST /api/prediction/trajectory
Authorization: Bearer {token}
Content-Type: application/json

{
  "childId": "child_id",
  "timeHorizon": 6,
  "dimensions": ["physical", "cognitive"]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "trajectory": [
      {
        "month": 1,
        "predictions": {
          "physical": 75,
          "cognitive": 80
        }
      }
    ],
    "confidence": 0.85,
    "nextMilestones": [
      {
        "title": "string",
        "expectedDate": "2024-06-01",
        "confidence": 0.9
      }
    ]
  }
}
```

### 风险评估
```http
POST /api/prediction/risk-assessment
Authorization: Bearer {token}
Content-Type: application/json

{
  "childId": "child_id"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "overallRisk": "low",
    "riskScore": 0.15,
    "riskFactors": [
      {
        "category": "physical",
        "level": "low",
        "description": "string",
        "recommendations": ["string"]
      }
    ],
    "confidence": 0.85
  }
}
```

### 预测历史
```http
GET /api/prediction/history?childId={childId}&type={type}&limit={limit}
Authorization: Bearer {token}
```

### 预测对比
```http
POST /api/prediction/compare
Authorization: Bearer {token}
Content-Type: application/json

{
  "predictionIds": ["id1", "id2"]
}
```

---

## 📄 报告系统

### 获取报告列表
```http
GET /api/reports/list?type={type}&page={page}&limit={limit}
Authorization: Bearer {token}
```

**type可选值**:
- `all`: 全部
- `weekly`: 周报
- `monthly`: 月报
- `quarterly`: 季报
- `annual`: 年报
- `birthday`: 生日报告

### 获取报告详情
```http
GET /api/reports/{id}
Authorization: Bearer {token}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "_id": "report_id",
    "userId": "user_id",
    "childId": "child_id",
    "type": "monthly",
    "title": "string",
    "content": "markdown_string",
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "metadata": {
      "insights": [],
      "predictions": [],
      "statistics": {}
    }
  }
}
```

### 生成报告
```http
POST /api/reports/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "childId": "child_id",
  "type": "monthly",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

### 导出报告
```http
GET /api/reports/{id}/export/html
Authorization: Bearer {token}
```

```http
GET /api/reports/{id}/export/pdf
Authorization: Bearer {token}
```

---

## 🔔 通知系统

### 获取通知列表
```http
GET /api/notifications?page={page}&limit={limit}&type={type}
Authorization: Bearer {token}
```

**type可选值**:
- `all`: 全部
- `risk`: 风险预警
- `milestone`: 里程碑提醒
- `system`: 系统通知

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "notification_id",
      "userId": "user_id",
      "type": "risk",
      "title": "string",
      "content": "string",
      "priority": "high",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### 标记为已读
```http
PUT /api/notifications/{id}/read
Authorization: Bearer {token}
```

### 删除通知
```http
DELETE /api/notifications/{id}
Authorization: Bearer {token}
```

### 获取风险趋势
```http
GET /api/notifications/risk-trend?days={days}
Authorization: Bearer {token}
```

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "riskLevel": "low",
      "riskScore": 0.15
    }
  ]
}
```

---

## 🔗 分享系统

### 生成分享链接
```http
POST /api/share/report/{reportId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "string",
  "expiresIn": 7,
  "maxViews": 10
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "shareToken": "unique_token",
    "shareUrl": "http://example.com/share/unique_token",
    "expiresAt": "2024-01-08T00:00:00.000Z",
    "maxViews": 10
  }
}
```

### 访问分享内容
```http
GET /api/share/{shareToken}
POST /api/share/{shareToken}
Content-Type: application/json

{
  "password": "string"
}
```

### 删除分享链接
```http
DELETE /api/share/report/{reportId}
Authorization: Bearer {token}
```

---

## 🔍 搜索系统

### 全局搜索
```http
GET /api/search?query={keyword}&type={type}&page={page}&limit={limit}&sortBy={sortBy}
Authorization: Bearer {token}
```

**type可选值**:
- `all`: 全部
- `record`: 成长记录
- `milestone`: 里程碑
- `plan`: 成长计划
- `report`: 报告

**sortBy可选值**:
- `relevance`: 相关性（默认）
- `date`: 日期

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "id",
      "type": "record",
      "title": "string",
      "content": "string",
      "relevance": 0.95,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "typeCounts": {
    "record": 50,
    "milestone": 30,
    "plan": 15,
    "report": 5
  }
}
```

### 搜索建议
```http
GET /api/search/suggestions?query={keyword}&limit={limit}
Authorization: Bearer {token}
```

---

## 📊 成长仪表盘

### 获取统计数据
```http
GET /api/growth-dashboard/stats?timeRange={timeRange}
Authorization: Bearer {token}
```

**timeRange可选值**:
- `week`: 本周
- `month`: 本月（默认）
- `year`: 本年

**响应**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRecords": 100,
      "totalMilestones": 20,
      "totalActivities": 50,
      "happyDays": 25,
      "currentStreak": 7
    },
    "emotionDistribution": [
      {
        "emotion": "happy",
        "count": 30
      }
    ],
    "activityCategories": [
      {
        "name": "体育运动",
        "count": 15
      }
    ],
    "weeklyTrend": [
      {
        "_id": "2024-01-01",
        "records": 5
      }
    ],
    "growthScores": [
      {
        "name": "身体发展",
        "score": 85,
        "color": "#10b981"
      }
    ]
  }
}
```

---

## 🎨 文化传承

### 获取文化活动
```http
GET /api/cultural/activities?age={age}&season={season}&category={category}
Authorization: Bearer {token}
```

**season可选值**: `春`, `夏`, `秋`, `冬`

**category可选值**:
- `传统节日`
- `文化故事`
- `诗词歌赋`
- `手工制作`
- `传统游戏`
- `民间艺术`

### 获取文化活动详情
```http
GET /api/cultural/activities/{id}
Authorization: Bearer {token}
```

### 获取文化故事
```http
GET /api/cultural/stories?age={age}&limit={limit}
Authorization: Bearer {token}
```

### 获取古诗词
```http
GET /api/cultural/poetry?age={age}&limit={limit}
Authorization: Bearer {token}
```

---

## 📋 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE"
}
```

### 分页响应
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## 🔒 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |

---

## 📝 注意事项

1. 所有需要认证的接口都需要在请求头中添加 `Authorization: Bearer {token}`
2. 所有时间格式采用 ISO 8601 标准（`YYYY-MM-DDTHH:mm:ss.sssZ`）
3. 分页参数 `page` 从 1 开始
4. 请求限流：每个IP每分钟最多100个请求

---

**文档版本**: v1.0  
**最后更新**: 2024年11月
