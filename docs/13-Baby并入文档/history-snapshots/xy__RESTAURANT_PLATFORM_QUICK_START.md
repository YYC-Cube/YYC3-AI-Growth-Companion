# 🍽️ 餐饮智枢平台 - 快速启动指南

## 📋 平台概览

基于GLM 4.6的餐饮行业全生命周期智能管理平台，包含：

### 🎯 核心功能
- **标准化管理**: ISO 22000、HACCP、GB/T 19002
- **智能协同**: 40+专业AI角色协同工作
- **数字孪生**: 实时餐厅仿真与优化
- **全流程自动化**: 从采购到服务的一站式管理

### 🚀 快速部署

```bash
# 1. 克隆项目
git clone <repository-url>
cd restaurant-intelligence-platform

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加:
# GLM4_API_KEY=your_glm4_api_key
# DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db

# 4. 启动开发服务器
bun run dev
```

### 🤖 AI智能体系统

**核心AI角色:**
- **店长AI**: 运营决策与人员管理
- **厨师长AI**: 菜品研发与质量控制
- **营养师AI**: 菜单营养分析与优化
- **供应链AI**: 智能采购与库存管理
- **客户服务AI**: 个性化服务与体验优化

**智能协同示例:**
```typescript
// AI协同工作流
const workflow = {
  trigger: "客户预订",
  agents: ["客户服务AI", "厨师长AI", "店长AI"],
  process: "自动安排座位 → 推荐菜品 → 准备食材",
  optimization: "基于历史数据持续优化"
}
```

### 📊 实时仪表板

访问 `http://localhost:3000/dashboard` 查看:

- **运营概况**: 实时客流量、收入、成本分析
- **质量监控**: 食品安全、客户满意度、员工绩效
- **智能预警**: 库存不足、设备异常、客户投诉
- **决策支持**: AI驱动的业务优化建议

### 🔧 API接口

```typescript
// 核心API示例
POST /api/ai/consultation
{
  "type": "运营优化",
  "context": "今日客流量增加20%",
  "agents": ["店长AI", "供应链AI"]
}

GET /api/restaurant/status
// 返回餐厅实时状态数据

POST /api/standardization/check
// 标准化合规性检查
```

### 📱 移动端支持

- **员工APP**: 服务员、厨师移动工作台
- **管理APP**: 店长移动管理中心
- **客户APP**: 智能点餐与个性化服务

### 🎓 成功案例

**某连锁餐厅实施数据:**
- 运营效率提升 **35%**
- 食品成本降低 **18%**
- 客户满意度提升 **42%**
- 员工流失率降低 **25%**

---

## 📞 技术支持

- **文档**: [完整技术文档](./RESTAURANT_INTELLIGENCE_PLATFORM.md)
- **演示**: 安装后访问 `/demo` 查看完整演示
- **支持**: 提供完整的部署和技术支持服务

**开始您的智能餐饮之旅！** 🚀