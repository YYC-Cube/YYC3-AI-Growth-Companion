# 📡 YYC³ AI小语智能成长守护系统 - API接口文档

## 1. 文档信息

| 项目 | 内容 |
|------|------|
| 文档编号 | DOC-API-002 |
| 文档版本 | 1.0.0 |
| 创建日期 | 2025-01-06 |
| 更新日期 | 2025-01-06 |
| 文档作者 | YYC³团队 |
| 文档状态 | 初稿 |

## 2. 概述

### 2.1 文档目的

本文档详细描述了YYC³ AI小语智能成长守护系统的API接口规范，包括接口URL、请求方法、参数说明、响应格式等，为前端开发、后端开发和测试人员提供API使用指南。

### 2.2 适用范围

- 前端开发人员：使用API与后端进行交互
- 后端开发人员：实现和维护API接口
- 测试人员：编写API测试用例
- 产品人员：了解系统功能和接口设计

### 2.3 术语定义

| 术语 | 解释 |
|------|------|
| API | 应用程序编程接口(Application Programming Interface) |
| RESTful | 一种API设计风格，基于HTTP协议 |
| JSON | JavaScript对象表示法(JavaScript Object Notation) |
| 请求头 | HTTP请求的元数据信息 |
| 响应头 | HTTP响应的元数据信息 |
| 状态码 | HTTP请求的处理结果代码 |

## 3. 接口列表

### 3.1 AI聊天接口

#### 3.1.1 发送聊天消息

| 项目 | 内容 |
|------|------|
| 接口URL | `/api/ai/chat` |
| 请求方法 | `POST` |
| 接口描述 | 向AI助手发送聊天消息并获取响应 |
| 认证方式 | 无需认证 |
| 响应格式 | `text/event-stream`(Server-Sent Events) |

##### 分析成长记录请求参数

```json
{
  "message": "string", // 必填，用户发送的消息内容
  "history": "array", // 可选，聊天历史记录
  "role": "string", // 可选，指定AI角色
  "complexity": "string", // 可选，回复复杂度
  "involvedRoles": "array" // 可选，涉及的角色列表
}
```

##### 分析成长记录请求示例

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，小语！"}'
```

##### 响应格式

```text
data: {"content": "您好！我是小语AI助手，很高兴为您提供育儿帮助。今天想聊什么呢？", "role": "all", "complexity": "low"}

data: [DONE]
```

##### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| content | string | AI助手的回复内容 |
| role | string | AI助手当前的角色 |
| complexity | string | 回复的复杂度 |
| [DONE] | string | 表示响应结束的标记 |

##### 分析成长记录错误响应示例

```json
{
  "error": "处理失败，请稍后重试"
}
```

#### 3.1.2 分析成长记录

| 项目 | 内容 |
|------|------|
| 接口URL | `/api/ai/analyze-record` |
| 请求方法 | `POST` |
| 接口描述 | 分析宝宝的成长记录并生成建议 |
| 认证方式 | 无需认证 |
| 响应格式 | `application/json` |

##### 用户注册请求参数

```json
{
  "record": "string", // 必填，成长记录内容
  "childInfo": {
    "age": "number", // 可选，宝宝年龄（月）
    "gender": "string" // 可选，宝宝性别
  }
}
```

##### 请求示例

```bash
curl -X POST http://localhost:3000/api/ai/analyze-record \
  -H "Content-Type: application/json" \
  -d '{"record": "宝宝今天学会了爬","childInfo": {"age": 8, "gender": "男"}}'
```

##### 用户注册响应示例

```json
{
  "success": true,
  "analysis": "宝宝在8个月学会爬行是发育正常的表现，建议继续鼓励宝宝多爬行，有助于锻炼四肢协调能力和平衡感。",
  "suggestions": [
    "为宝宝提供安全的爬行环境",
    "可以使用玩具引导宝宝爬行",
    "注意观察宝宝的爬行姿势是否正确"
  ]
}
```

##### 错误响应示例

```json
{
  "success": false,
  "error": "分析失败，请稍后重试"
}
```

### 3.2 用户相关接口

#### 3.2.1 用户注册

| 项目 | 内容 |
|------|------|
| 接口URL | `/api/users/register` |
| 请求方法 | `POST` |
| 接口描述 | 用户注册接口 |
| 认证方式 | 无需认证 |
| 响应格式 | `application/json` |

##### 用户登录请求参数

```json
{
  "username": "string", // 必填，用户名
  "email": "string", // 必填，邮箱
  "password": "string", // 必填，密码
  "childInfo": {
    "name": "string", // 可选，宝宝姓名
    "age": "number", // 可选，宝宝年龄（月）
    "gender": "string" // 可选，宝宝性别
  }
}
```

##### 用户登录响应示例

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string"
  }
}
```

#### 3.2.2 用户登录

| 项目 | 内容 |
|------|------|
| 接口URL | `/api/users/login` |
| 请求方法 | `POST` |
| 接口描述 | 用户登录接口 |
| 认证方式 | 无需认证 |
| 响应格式 | `application/json` |

##### 创建成长记录请求参数

```json
{
  "email": "string", // 必填，邮箱
  "password": "string" // 必填，密码
}
```

##### 创建成长记录响应示例

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "userId": "string",
    "username": "string",
    "token": "string"
  }
}
```

### 3.3 成长记录接口

#### 3.3.1 创建成长记录

| 项目 | 内容 |
|------|------|
| 接口URL | `/api/growth-records` |
| 请求方法 | `POST` |
| 接口描述 | 创建宝宝的成长记录 |
| 认证方式 | 需要认证 |
| 响应格式 | `application/json` |

##### 获取成长记录列表请求参数

```json
{
  "type": "string", // 必填，记录类型（如：饮食、睡眠、运动、学习）
  "content": "string", // 必填，记录内容
  "date": "string", // 必填，记录日期（格式：YYYY-MM-DD HH:mm:ss）
  "media": "array", // 可选，媒体文件列表
  "tags": "array" // 可选，标签列表
}
```

##### 获取成长记录列表响应示例

```json
{
  "success": true,
  "message": "记录创建成功",
  "data": {
    "recordId": "string",
    "type": "string",
    "content": "string",
    "date": "string",
    "createdAt": "string"
  }
}
```

#### 3.3.2 获取成长记录列表

| 项目 | 内容 |
|------|------|
| 接口URL | `/api/growth-records` |
| 请求方法 | `GET` |
| 接口描述 | 获取宝宝的成长记录列表 |
| 认证方式 | 需要认证 |
| 响应格式 | `application/json` |

##### 请求参数

| 参数名 | 类型 | 位置 | 必填 | 说明 |
|--------|------|------|------|------|
| page | number | query | 否 | 页码，默认1 |
| limit | number | query | 否 | 每页数量，默认10 |
| type | string | query | 否 | 记录类型 |
| startDate | string | query | 否 | 开始日期 |
| endDate | string | query | 否 | 结束日期 |

##### 响应示例

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "records": [
      {
        "recordId": "string",
        "type": "string",
        "content": "string",
        "date": "string",
        "tags": ["string"],
        "createdAt": "string"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 4. 接口规范

### 4.1 请求规范

1. **HTTP方法**
   - `GET`: 获取资源
   - `POST`: 创建资源
   - `PUT`: 更新资源
   - `DELETE`: 删除资源

2. **请求头**
   - `Content-Type`: 通常为 `application/json`
   - `Authorization`: 认证令牌（需要认证的接口）

3. **请求参数**
   - 路径参数：如 `/api/users/{id}`
   - 查询参数：如 `/api/users?page=1&limit=10`
   - 请求体：JSON格式的请求数据

### 4.2 响应规范

1. **状态码**
   - `200 OK`: 请求成功
   - `201 Created`: 资源创建成功
   - `400 Bad Request`: 请求参数错误
   - `401 Unauthorized`: 未授权
   - `403 Forbidden`: 禁止访问
   - `404 Not Found`: 资源不存在
   - `500 Internal Server Error`: 服务器内部错误

2. **响应格式**
   - 通常为JSON格式
   - 统一包含 `success`、`message` 和 `data` 字段

3. **错误处理**
   - 错误响应包含 `success`、`message` 和 `error` 字段
   - 提供清晰的错误信息，便于问题定位

### 4.3 认证规范

- 使用JWT令牌进行认证
- 令牌通过 `Authorization` 请求头传递
- 格式：`Authorization: Bearer {token}`

### 4.4 安全规范

1. **输入验证**
   - 对所有输入参数进行严格验证
   - 使用Zod等工具进行数据验证

2. **输出过滤**
   - 过滤敏感信息，如密码、令牌等
   - 避免暴露系统内部信息

3. **请求限流**
   - 对API请求进行限流，防止滥用
   - 使用合适的限流算法，如令牌桶算法

## 5. 测试指南

### 5.1 测试工具

- Postman：API测试工具
- Curl：命令行HTTP客户端
- Jest：JavaScript测试框架

### 5.2 测试用例设计

1. **功能测试**
   - 测试API的基本功能是否正常
   - 测试不同参数组合的处理

2. **边界测试**
   - 测试参数的边界值
   - 测试异常情况的处理

3. **性能测试**
   - 测试API的响应时间
   - 测试API的并发处理能力

4. **安全测试**
   - 测试认证和授权机制
   - 测试输入验证和输出过滤

## 6. 部署信息

### 6.1 环境配置

| 环境 | API地址 |
|------|---------|
| 开发环境 | <http://localhost:3000/api> |
| 测试环境 | <https://test-api.yyc3.com/api> |
| 生产环境 | <https://api.yyc3.com/api> |

### 6.2 依赖服务

- Next.js 14.0.0+
- Node.js 20.0.0+
- TypeScript 5.0.0+

## 7. 参考资料

- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

## 8. 版本历史

| 版本 | 更新日期 | 更新内容 | 更新人 |
|------|----------|----------|--------|
| 1.0.0 | 2025-01-06 | 初始版本，包含AI聊天接口等核心API | YYC³团队 |
