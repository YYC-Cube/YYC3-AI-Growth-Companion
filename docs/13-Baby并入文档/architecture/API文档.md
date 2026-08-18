# YYC³ AI小语成长守护系统 - API文档

## 概述

YYC³ AI小语成长守护系统是一个基于事件驱动+目标驱动混合架构的现代化AI服务平台，提供智能AI组件、动态工具生态、RAG知识库和多模态交互功能。本文档详细描述了系统中所有可用的API接口及其功能。

## 基础信息

- **基础URL**: `http://localhost:1229/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: JWT Token (部分接口需要)

---

## AI服务接口

### 1. AI聊天接口

**接口地址**: `POST /api/ai/chat`

**功能描述**: 提供基于角色的AI聊天服务，支持多种角色切换和智能对话。

**请求参数**:
```json
{
  "message": "用户输入的消息内容",
  "role": "recorder|guardian|listener|advisor|cultural_tutor",
  "childId": "孩子ID（可选）",
  "context": "对话上下文（可选）"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "message": "AI回复内容",
    "role": "guardian",
    "timestamp": "2025-01-30T10:30:00Z",
    "suggestions": ["建议1", "建议2"]
  }
}
```

**支持的角色类型**:
- **记录者 (recorder)**: 捕捉成长瞬间，生成温暖故事
- **守护者 (guardian)**: 基于科学标准评估发展状况
- **聆听者 (listener)**: 理解情绪行为，促进亲子沟通
- **建议者 (advisor)**: 提供多元选择，培养自主性
- **国粹导师 (cultural_tutor)**: 传承文化智慧，浸润传统教育

---

### 2. 情感分析接口

**接口地址**: `POST /api/ai/emotion`

**功能描述**: 分析文本中的情感倾向，提供情感状态评估和建议。

**请求参数**:
```json
{
  "text": "需要分析的文本内容",
  "includeAdvice": true
}
```

**响应示例**:
```json
{
  "emotion": "happy",
  "confidence": 0.85,
  "valence": 0.8,
  "arousal": 0.6,
  "keywords": ["开心", "高兴"],
  "advice": "保持这种积极的心态，继续努力！可以和家人分享你的快乐哦~"
}
```

**情感类型说明**:
- **happy**: 开心、快乐
- **sad**: 难过、伤心
- **angry**: 生气、愤怒
- **excited**: 兴奋、激动
- **calm**: 平静、放松
- **anxious**: 紧张、焦虑
- **neutral**: 中性、平静

---

### 3. 发展评估报告接口

**接口地址**: `POST /api/ai/assessment-report`

**功能描述**: 基于儿童发展评估数据生成专业的AI评估报告。

**请求参数**:
```json
{
  "childName": "孩子姓名",
  "childAge": 36,
  "stageId": "stage_3_4_years",
  "stageName": "3-4岁阶段",
  "scores": {
    "cognitive": 85,
    "language": 78,
    "social": 92,
    "motor": 80,
    "emotional": 75
  },
  "answers": ["答案1", "答案2", "..."]
}
```

**响应示例**:
```json
{
  "id": "report_1643512800000",
  "childName": "小明",
  "childAge": 36,
  "stageId": "stage_3_4_years",
  "stageName": "3-4岁阶段",
  "assessmentDate": "2025-01-30T10:30:00Z",
  "dimensionScores": {
    "cognitive": {
      "score": 85,
      "level": "优秀",
      "percentile": 95,
      "description": "在同龄儿童中表现突出"
    }
  },
  "overallLevel": "发展良好",
  "aiAnalysis": "详细的AI分析报告...",
  "recommendations": ["建议1", "建议2"],
  "nextSteps": ["下一步行动1", "下一步行动2"]
}
```

---

### 4. AI故事续写接口

**接口地址**: `POST /api/ai/continue-story`

**功能描述**: 基于提供的故事开头，AI智能续写儿童故事。

**请求参数**:
```json
{
  "storyStart": "故事开头内容",
  "theme": "冒险|友谊|学习|成长",
  "childAge": 5,
  "length": "short|medium|long"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "story": "完整的故事内容",
    "illustrations": ["插图描述1", "插图描述2"],
    "questions": ["理解问题1", "理解问题2"],
    "moral": "故事寓意"
  }
}
```

---

### 5. AI图像生成接口

**接口地址**: `POST /api/ai/generate-image`

**功能描述**: 基于文本描述生成适合儿童的插图。

**请求参数**:
```json
{
  "prompt": "图像描述文本",
  "style": "cartoon|watercolor|picture_book",
  "age": 5
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "imageUrl": "生成的图像URL",
    "description": "图像描述",
    "safety": "safe"
  }
}
```

---

### 6. AI记录分析接口

**接口地址**: `POST /api/ai/analyze-record`

**功能描述**: 分析成长记录，提取关键信息和成长洞察。

**请求参数**:
```json
{
  "record": "成长记录内容",
  "childId": "孩子ID",
  "recordType": "milestone|daily|observation"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "summary": "记录摘要",
    "milestones": ["里程碑1", "里程碑2"],
    "developmentAreas": ["发展领域1", "发展领域2"],
    "suggestions": ["建议1", "建议2"]
  }
}
```

---

### 7. AI服务编排接口

**接口地址**: `POST /api/ai/orchestrate`

**功能描述**: 协调多个AI服务，提供综合性的智能解决方案。

**请求参数**:
```json
{
  "task": "任务类型",
  "input": "输入数据",
  "services": ["service1", "service2"],
  "childId": "孩子ID"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "result": "综合处理结果",
    "services": {
      "service1": "服务1结果",
      "service2": "服务2结果"
    },
    "recommendations": ["综合建议1", "综合建议2"]
  }
}
```

---

## 数据管理接口

### 1. 儿童档案管理接口

**接口地址**: `GET /api/children`
**功能描述**: 获取儿童档案列表

**请求参数**:
- `childId` (可选): 特定儿童ID
- `page` (可选): 页码
- `limit` (可选): 每页数量

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "child_001",
      "name": "小明",
      "nickname": "明明",
      "age_years": 5,
      "age_months": 6,
      "gender": "male",
      "current_stage": "5-6岁阶段",
      "avatar": "头像URL",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**接口地址**: `POST /api/children`
**功能描述**: 创建新的儿童档案

**请求参数**:
```json
{
  "name": "儿童姓名",
  "nickname": "昵称",
  "age_years": 5,
  "age_months": 6,
  "gender": "male|female",
  "avatar": "头像URL（可选）"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "child_002",
    "name": "小红",
    "nickname": "红红",
    "age_years": 4,
    "age_months": 3,
    "gender": "female",
    "current_stage": "4-5岁阶段",
    "created_at": "2025-01-30T10:30:00Z"
  }
}
```

---

### 2. 成长记录管理接口

**接口地址**: `GET /api/growth-records`
**功能描述**: 获取成长记录列表

**请求参数**:
- `childId` (可选): 特定儿童ID
- `type` (可选): 记录类型 (milestone|daily|observation)
- `startDate` (可选): 开始日期
- `endDate` (可选): 结束日期

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "record_001",
      "child_id": "child_001",
      "type": "milestone",
      "title": "第一次独立走路",
      "content": "今天小明终于独立走路了...",
      "recorded_at": "2025-01-15T10:30:00Z",
      "media": ["图片URL1", "视频URL1"],
      "tags": ["运动发展", "里程碑"]
    }
  ]
}
```

**接口地址**: `POST /api/growth-records`
**功能描述**: 创建新的成长记录

**请求参数**:
```json
{
  "child_id": "child_001",
  "type": "milestone|daily|observation",
  "title": "记录标题",
  "content": "记录内容",
  "media": ["媒体文件URL数组"],
  "tags": ["标签1", "标签2"]
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "record_002",
    "child_id": "child_001",
    "type": "daily",
    "title": "今天的学习成果",
    "content": "今天学会了写自己的名字...",
    "recorded_at": "2025-01-30T10:30:00Z",
    "media": [],
    "tags": ["学习", "写字"]
  }
}
```

---

### 3. 作业管理接口

**接口地址**: `GET /api/homework`
**功能描述**: 获取作业列表

**请求参数**:
- `childId` (可选): 特定儿童ID
- `status` (可选): 作业状态 (pending|done|review)
- `subject` (可选): 学科 (语文|数学|英语)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "hw_001",
      "child_id": "child_001",
      "subject": "语文",
      "title": "古诗词背诵",
      "description": "背诵《静夜思》并录制音频",
      "due_date": "2025-01-30T18:00:00Z",
      "status": "pending",
      "progress": 0
    }
  ]
}
```

**接口地址**: `POST /api/homework`
**功能描述**: 创建新的作业任务

**请求参数**:
```json
{
  "child_id": "child_001",
  "subject": "数学",
  "title": "口算练习",
  "description": "完成10道两位数加减法",
  "due_date": "2025-01-31T09:00:00Z",
  "difficulty": "easy|medium|hard"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "hw_002",
    "child_id": "child_001",
    "subject": "数学",
    "title": "口算练习",
    "description": "完成10道两位数加减法",
    "due_date": "2025-01-31T09:00:00Z",
    "status": "pending",
    "difficulty": "medium",
    "created_at": "2025-01-30T10:30:00Z"
  }
}
```

---

## 错误处理

所有API接口都遵循统一的错误处理格式：

```json
{
  "success": false,
  "error": "错误描述信息",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-30T10:30:00Z"
}
```

### 常见错误码

- `INVALID_REQUEST`: 请求参数无效
- `UNAUTHORIZED`: 未授权访问
- `NOT_FOUND`: 资源不存在
- `INTERNAL_ERROR`: 服务器内部错误
- `RATE_LIMIT_EXCEEDED`: 请求频率超限
- `AI_SERVICE_ERROR`: AI服务错误

---

## 认证机制

对于需要认证的接口，请在请求头中包含JWT Token：

```
Authorization: Bearer <your_jwt_token>
```

获取Token的接口：
- **登录**: `POST /api/auth/login`
- **刷新Token**: `POST /api/auth/refresh`

---

## 使用限制

1. **请求频率限制**: 每分钟最多100次请求
2. **文件上传限制**: 单个文件最大10MB
3. **AI服务限制**: 每日最多1000次AI调用
4. **数据保留期**: 用户数据保留365天

---

## SDK支持

我们提供以下语言的SDK：

- **JavaScript/TypeScript**: `@yyc3/ai-sdk`
- **Python**: `yyc3-ai-python`
- **Java**: `com.yyc3.ai-sdk`

---

## 更新日志

### v1.2.0 (2025-01-30)
- 新增情感分析接口
- 优化评估报告生成算法
- 修复作业管理接口的bug

### v1.1.0 (2025-01-15)
- 新增AI图像生成功能
- 支持批量操作
- 优化响应速度

### v1.0.0 (2025-01-01)
- 初始版本发布
- 基础AI聊天功能
- 儿童档案管理
- 成长记录功能

---

## 技术支持

如有任何问题或建议，请联系：

- **技术支持邮箱**: support@yyc3.com
- **开发者文档**: https://docs.yyc3.com
- **社区论坛**: https://community.yyc3.com

---

<div align="center">

**YYC³ 团队**

**万象归元于云枢 | 深栈智启新纪元**

</div>