---
@file: 027-YYC3-XY-技巧类-编码规范手册.md
@description: YYC3-XY项目技巧类编码规范手册文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-25
@updated: 2025-12-25
@status: published
@tags: 编码规范,代码质量,最佳实践,开发规范
---

# YYC3-XY 编码规范手册

## 文档信息
- **文档类型**：技巧类
- **所属阶段**：YYC3-XY-开发实施
- **遵循规范**：五高五标五化要求
- **版本号**：V1.0.0

---

## **"五高"战略定位**

- **高可用性**：代码健壮性保障，异常处理覆盖率100%，系统稳定性≥99.95%
- **高性能**：代码执行效率优化，关键路径性能提升≥30%，资源利用率优化≥25%
- **高安全性**：安全编码规范落实，代码安全漏洞零容忍，安全扫描通过率100%
- **高扩展性**：模块化设计，代码复用率≥60%，扩展能力支持≥100个功能模块
- **高可维护性**：代码可读性保障，注释覆盖率≥80%，代码审查通过率≥95%

---

## **"五标"标准化要求**

- **标准化**：统一编码风格，遵循项目代码规范，代码一致性≥90%
- **规范化**：命名规范统一，代码结构清晰，规范遵循率100%
- **自动化**：自动化代码检查，静态分析覆盖率100%，CI/CD集成率100%
- **智能化**：智能代码辅助，AI工具集成率≥80%，智能建议采纳率≥60%
- **可视化**：代码质量可视化，质量指标实时监控，质量报告自动生成

---

## **"五化"实施路径**

- **流程化**：编码流程标准化，代码评审流程化，流程执行率100%
- **文档化**：编码规范文档化，代码注释规范化，文档完整度≥95%
- **工具化**：编码工具集成化，开发工具统一化，工具使用率100%
- **数字化**：代码质量数字化，质量数据实时化，数据准确率≥99%
- **生态化**：编码生态协同化，团队协作高效化，协作效率提升≥40%

---

> **「YanYuCloudCube」**
> **「<admin@0379.email>」**
> **「Words Initiate Quadrants, Language Serves as Core for the Future」**
> **「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」**

---

## 一、通用编码原则

### 1.1 代码质量原则

- **KISS原则**：保持简单，避免过度设计
- **DRY原则**：不要重复自己，代码复用优先
- **YAGNI原则**：你不会需要它，避免过度设计
- **单一职责**：每个函数/类只做一件事
- **开闭原则**：对扩展开放，对修改关闭

### 1.2 代码可读性原则

- **命名清晰**：变量、函数、类名要能清晰表达意图
- **注释充分**：关键逻辑必须添加注释
- **格式统一**：代码格式保持一致性
- **逻辑简洁**：避免嵌套过深，逻辑清晰
- **长度适中**：函数长度不超过50行，文件不超过500行

### 1.3 代码可维护性原则

- **模块化设计**：功能模块化，职责分离
- **接口抽象**：面向接口编程，降低耦合
- **依赖注入**：使用依赖注入，便于测试
- **配置外置**：配置与代码分离
- **日志完善**：关键操作添加日志

---

## 二、命名规范

### 2.1 变量命名

#### 2.1.1 命名规则

- **驼峰命名法**：使用camelCase
- **语义化**：名称要能清晰表达变量用途
- **禁止拼音**：不允许使用拼音或拼音+英文混合
- **避免缩写**：除通用缩写外，避免使用缩写

#### 2.1.2 命名示例

```typescript
// ✅ 正确示例
const userName = 'John';
const userAge = 25;
const isActive = true;
const maxRetryCount = 3;
const systemConfig = {};

// ❌ 错误示例
const yhm = 'John';  // 拼音
const u_age = 25;    // 下划线
const flag = true;   // 语义不清
const mrc = 3;       // 缩写不明确
```

#### 2.1.3 布尔变量命名

- 使用is/has/can/should等前缀
- 表达明确的布尔语义

```typescript
// ✅ 正确示例
const isValid = true;
const hasPermission = false;
const canEdit = true;
const shouldRetry = false;

// ❌ 错误示例
const valid = true;
const permission = false;
const edit = true;
const retry = false;
```

### 2.2 函数命名

#### 2.2.1 命名规则

- **动词+名词**：清晰表达函数动作
- **驼峰命名法**：使用camelCase
- **单一职责**：函数名要体现单一功能
- **返回值明确**：通过函数名暗示返回值

#### 2.2.2 命名示例

```typescript
// ✅ 正确示例
function getUserById(userId: string): User {
  return {};
}

function validateEmail(email: string): boolean {
  return true;
}

function calculateTotalPrice(items: Item[]): number {
  return 0;
}

async function fetchUserData(userId: string): Promise<User> {
  return {};
}

// ❌ 错误示例
function user(id: string): User {
  return {};
}

function check(email: string): boolean {
  return true;
}

function calc(items: Item[]): number {
  return 0;
}
```

#### 2.2.3 常用动词前缀

| 前缀 | 用途 | 示例 |
|------|------|------|
| get | 获取数据 | getUser, getConfig |
| set | 设置数据 | setUser, setConfig |
| is | 判断状态 | isValid, isActive |
| has | 判断包含 | hasPermission, hasRole |
| can | 判断能力 | canEdit, canDelete |
| create | 创建对象 | createUser, createOrder |
| update | 更新对象 | updateUser, updateOrder |
| delete | 删除对象 | deleteUser, deleteOrder |
| fetch | 异步获取 | fetchData, fetchUser |
| validate | 验证数据 | validateEmail, validateForm |
| calculate | 计算值 | calculateTotal, calculateAverage |

### 2.3 类命名

#### 2.3.1 命名规则

- **帕斯卡命名法**：使用PascalCase
- **名词为主**：类名应为名词
- **语义明确**：清晰表达类的职责
- **避免后缀**：除必要外避免使用Manager、Handler等后缀

#### 2.3.2 命名示例

```typescript
// ✅ 正确示例
class UserService {}
class OrderController {}
class UserRepository {}
class EmailValidator {}
class PaymentProcessor {}

// ❌ 错误示例
class userService {}  // 驼峰
class UserMng {}     // 缩写
class UserDo {}      // 后缀不明确
```

### 2.4 常量命名

#### 2.4.1 命名规则

- **全大写下划线**：使用UPPER_SNAKE_CASE
- **语义明确**：清晰表达常量含义
- **分组前缀**：相关常量使用统一前缀

#### 2.4.2 命名示例

```typescript
// ✅ 正确示例
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;
const API_BASE_URL = 'https://api.example.com';
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

// ❌ 错误示例
const maxRetryCount = 3;      // 驼峰
const MAXRETRYCOUNT = 3;      // 无下划线
const timeout = 5000;         // 不是常量风格
const url = 'https://api.example.com';  // 语义不清
```

### 2.5 接口命名

#### 2.5.1 命名规则

- **帕斯卡命名法**：使用PascalCase
- **I前缀可选**：根据团队规范决定是否使用I前缀
- **语义明确**：清晰表达接口用途

#### 2.5.2 命名示例

```typescript
// ✅ 正确示例（无I前缀）
interface User {}
interface UserRepository {}
interface EmailService {}

// ✅ 正确示例（有I前缀）
interface IUser {}
interface IUserRepository {}
interface IEmailService {}

// ❌ 错误示例
interface user {}  // 驼峰
interface UserDo {}  // 后缀不明确
```

### 2.6 文件命名

#### 2.6.1 命名规则

- **kebab-case**：使用短横线分隔
- **语义明确**：清晰表达文件内容
- **与类名对应**：文件名应与导出的主类名对应

#### 2.6.2 命名示例

```
✅ 正确示例
user-service.ts
order-controller.ts
email-validator.ts
payment-processor.ts

❌ 错误示例
userService.ts  // 驼峰
user_service.ts  // 下划线
User.ts         // 不明确
```

---

## 三、代码格式规范

### 3.1 缩进与空格

#### 3.1.1 缩进规则

- **使用空格**：使用2个空格缩进，不使用Tab
- **层级对齐**：同一层级的代码对齐
- **空行分隔**：逻辑块之间使用空行分隔

#### 3.1.2 格式示例

```typescript
// ✅ 正确示例
function processUserData(userId: string) {
  const user = getUserById(userId);

  if (!user) {
    return null;
  }

  const validated = validateUser(user);

  if (!validated) {
    throw new Error('Invalid user data');
  }

  return user;
}

// ❌ 错误示例
function processUserData(userId: string) {
    const user = getUserById(userId);  // 4个空格缩进
    if (!user) {
        return null;
    }
    const validated = validateUser(user);
    if (!validated) {
        throw new Error('Invalid user data');
    }
    return user;
}
```

### 3.2 行长度

#### 3.2.1 行长度规则

- **最大长度**：单行代码不超过100字符
- **合理换行**：超过长度限制时合理换行
- **运算符换行**：运算符放在行首

#### 3.2.2 换行示例

```typescript
// ✅ 正确示例
const result = await someVeryLongFunctionName(
  param1,
  param2,
  param3
);

const total = price * quantity +
  tax +
  shipping;

// ❌ 错误示例
const result = await someVeryLongFunctionName(param1, param2, param3);  // 超过100字符

const total = price * quantity + tax + shipping;  // 超过100字符
```

### 3.3 空格使用

#### 3.3.1 空格规则

- **运算符两侧**：二元运算符两侧加空格
- **逗号后**：逗号后加空格
- **括号内**：左括号后、右括号前不加空格
- **对象字面量**：冒号后加空格

#### 3.3.2 空格示例

```typescript
// ✅ 正确示例
const sum = a + b;
const result = (a + b) * c;
const user = { name: 'John', age: 25 };
const items = [1, 2, 3];

// ❌ 错误示例
const sum = a+b;              // 运算符无空格
const result = ( a + b ) * c; // 括号内有多余空格
const user = {name:'John',age:25};  // 冒号后无空格
const items = [1,2,3];        // 逗号后无空格
```

### 3.4 代码块

#### 3.4.1 代码块规则

- **大括号位置**：左大括号不换行
- **单行块**：简单语句可使用单行
- **空格使用**：大括号内加空格

#### 3.4.2 代码块示例

```typescript
// ✅ 正确示例
if (condition) {
  doSomething();
}

function example() {
  return value;
}

// ✅ 单行块示例
if (condition) doSomething();
const result = arr.map(x => x * 2);

// ❌ 错误示例
if (condition)
{
  doSomething();
}

function example()
{
  return value;
}
```

---

## 四、注释规范

### 4.1 注释原则

- **必要性**：只注释必要的内容
- **准确性**：注释必须准确反映代码
- **时效性**：代码变更时同步更新注释
- **简洁性**：注释简洁明了，避免冗余

### 4.2 文件注释

#### 4.2.1 文件注释格式

每个源文件开头必须包含文件注释，说明文件用途。

```typescript
/**
 * @file: user-service.ts
 * @description: 用户服务模块，提供用户相关的业务逻辑处理
 * @author: YYC3开发团队
 * @version: v1.0.0
 * @created: 2025-12-25
 */
```

### 4.3 函数注释

#### 4.3.1 函数注释格式

公共函数必须添加JSDoc注释，说明函数功能、参数、返回值。

```typescript
/**
 * 根据用户ID获取用户信息
 * @param userId - 用户ID
 * @returns 用户对象，如果用户不存在则返回null
 * @throws {Error} 当用户ID无效时抛出错误
 * @example
 * const user = getUserById('123');
 */
function getUserById(userId: string): User | null {
  if (!userId) {
    throw new Error('Invalid user ID');
  }
  return userRepository.findById(userId);
}
```

#### 4.3.2 注释要素

- **@description**：函数功能描述
- **@param**：参数说明（参数名、类型、描述）
- **@returns**：返回值说明
- **@throws**：可能抛出的异常
- **@example**：使用示例（可选）

### 4.4 类注释

#### 4.4.1 类注释格式

公共类必须添加JSDoc注释，说明类的职责。

```typescript
/**
 * 用户服务类
 * 提供用户相关的业务逻辑处理，包括用户查询、创建、更新、删除等操作
 */
class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * 根据用户ID获取用户信息
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}
```

### 4.5 行内注释

#### 4.5.1 行内注释规则

- **复杂逻辑**：复杂逻辑必须添加注释
- **业务规则**：业务规则必须添加注释
- **临时方案**：临时方案必须添加注释和TODO标记
- **注释位置**：注释放在代码上方

#### 4.5.2 行内注释示例

```typescript
// ✅ 正确示例
// 检查用户权限，只有管理员可以删除用户
if (user.role !== 'admin') {
  throw new Error('Permission denied');
}

// 计算折扣价格，节假日打8折
const discount = isHoliday ? 0.8 : 1.0;
const finalPrice = originalPrice * discount;

// TODO: 临时方案，后续需要优化性能
const result = heavyOperation();

// ❌ 错误示例
if (user.role !== 'admin') {  // 检查权限
  throw new Error('Permission denied');
}

const discount = isHoliday ? 0.8 : 1.0;  // 计算折扣
```

### 4.6 TODO和FIXME

#### 4.6.1 TODO标记

使用TODO标记待办事项，格式：`TODO: [作者] - 描述`

```typescript
// TODO: 张三 - 需要添加缓存机制提升性能
function getUserById(userId: string): User {
  return userRepository.findById(userId);
}
```

#### 4.6.2 FIXME标记

使用FIXME标记需要修复的问题，格式：`FIXME: [作者] - 描述`

```typescript
// FIXME: 李四 - 这里存在内存泄漏问题，需要修复
function processData(data: any[]): void {
  const cache = new Map();
  data.forEach(item => {
    cache.set(item.id, item);
  });
  // 缺少清理逻辑
}
```

---

## 五、TypeScript编码规范

### 5.1 类型定义

#### 5.1.1 类型定义规则

- **明确类型**：避免使用any，明确指定类型
- **接口优先**：优先使用interface定义对象类型
- **类型别名**：联合类型、交叉类型使用type
- **枚举使用**：固定值集合使用enum

#### 5.1.2 类型定义示例

```typescript
// ✅ 正确示例
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

type UserRole = 'admin' | 'user' | 'guest';

enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}

function getUserById(userId: string): User | null {
  return null;
}

// ❌ 错误示例
function getUserById(userId: any): any {
  return null;
}
```

### 5.2 函数类型

#### 5.2.1 函数类型定义

- **参数类型**：明确指定参数类型
- **返回类型**：明确指定返回类型
- **可选参数**：可选参数使用?标记
- **默认参数**：提供合理的默认值

#### 5.2.2 函数类型示例

```typescript
// ✅ 正确示例
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}

function processItems(
  items: Item[],
  options?: { skip: number; limit: number }
): ProcessedItem[] {
  return [];
}

// ❌ 错误示例
function greet(name, greeting) {
  return `${greeting}, ${name}!`;
}
```

### 5.3 泛型使用

#### 5.3.1 泛型规则

- **语义化命名**：使用T、U、V等泛型参数名
- **约束泛型**：使用extends约束泛型
- **默认类型**：提供合理的默认类型

#### 5.3.2 泛型示例

```typescript
// ✅ 正确示例
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
}

class Cache<T = any> {
  private data: Map<string, T> = new Map();

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  set(key: string, value: T): void {
    this.data.set(key, value);
  }
}

// ❌ 错误示例
function first(arr): any {
  return arr[0];
}
```

### 5.4 类型断言

#### 5.4.1 类型断言规则

- **谨慎使用**：避免过度使用类型断言
- **as语法**：使用as语法进行类型断言
- **类型守卫**：优先使用类型守卫

#### 5.4.2 类型断言示例

```typescript
// ✅ 正确示例（类型守卫）
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  }
}

// ✅ 正确示例（类型断言）
const element = document.getElementById('app') as HTMLElement;

// ❌ 错误示例（过度断言）
const user = data as User;  // 不安全的断言
```

---

## 六、错误处理规范

### 6.1 异常处理原则

- **预期错误**：使用返回值处理预期错误
- **异常情况**：使用异常处理异常情况
- **错误信息**：提供清晰的错误信息
- **错误日志**：记录详细的错误日志

### 6.2 错误抛出

#### 6.2.1 错误抛出规则

- **自定义错误**：使用自定义错误类
- **错误信息**：提供有用的错误信息
- **错误链**：保留原始错误信息

#### 6.2.2 错误抛出示例

```typescript
// ✅ 正确示例
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateEmail(email: string): void {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

async function getUserById(userId: string): Promise<User> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }
  return user;
}

// ❌ 错误示例
function validateEmail(email: string): void {
  if (!email.includes('@')) {
    throw new Error('error');  // 错误信息不清晰
  }
}
```

### 6.3 错误捕获

#### 6.3.1 错误捕获规则

- **精确捕获**：只捕获预期的错误
- **错误处理**：提供合理的错误处理
- **错误日志**：记录错误日志
- **错误传播**：无法处理的错误向上传播

#### 6.3.2 错误捕获示例

```typescript
// ✅ 正确示例
async function processUserData(userId: string): Promise<Result> {
  try {
    const user = await getUserById(userId);
    const processed = await processData(user);
    return { success: true, data: processed };
  } catch (error) {
    logger.error('Failed to process user data', { userId, error });
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ✅ 精确捕获
try {
  validateEmail(email);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed for field: ${error.field}`);
  } else {
    throw error;  // 重新抛出未知错误
  }
}

// ❌ 错误示例
try {
  await someOperation();
} catch (error) {
  // 吞掉错误，不记录日志
}
```

---

## 七、异步编程规范

### 7.1 Promise使用

#### 7.1.1 Promise规则

- **async/await**：优先使用async/await
- **错误处理**：使用try/catch处理错误
- **并行执行**：使用Promise.all并行执行
- **超时控制**：添加超时控制

#### 7.1.2 Promise示例

```typescript
// ✅ 正确示例
async function fetchUserData(userId: string): Promise<User> {
  try {
    const user = await userRepository.findById(userId);
    const profile = await profileRepository.findByUserId(userId);
    return { ...user, ...profile };
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw error;
  }
}

// ✅ 并行执行
async function fetchAllData(userId: string): Promise<{ user: User; orders: Order[] }> {
  const [user, orders] = await Promise.all([
    userRepository.findById(userId),
    orderRepository.findByUserId(userId)
  ]);
  return { user, orders };
}

// ✅ 超时控制
async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// ❌ 错误示例
function fetchUserData(userId: string): Promise<User> {
  return userRepository.findById(userId)
    .then(user => {
      return profileRepository.findByUserId(userId)
        .then(profile => ({ ...user, ...profile }));
    })
    .catch(error => {
      throw error;
    });
}
```

### 7.2 错误处理

#### 7.2.1 异步错误处理规则

- **try/catch**：使用try/catch捕获异步错误
- **错误传播**：无法处理的错误向上传播
- **错误日志**：记录异步错误日志

#### 7.2.2 异步错误处理示例

```typescript
// ✅ 正确示例
async function processOrder(orderId: string): Promise<void> {
  try {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    await paymentService.process(order);
    await notificationService.send(order);
  } catch (error) {
    logger.error('Failed to process order', { orderId, error });
    throw error;
  }
}

// ❌ 错误示例
async function processOrder(orderId: string): Promise<void> {
  const order = await orderRepository.findById(orderId);
  await paymentService.process(order);
  await notificationService.send(order);
  // 没有错误处理
}
```

---

## 八、性能优化规范

### 8.1 代码性能

#### 8.1.1 性能优化规则

- **避免重复计算**：缓存计算结果
- **批量操作**：使用批量操作代替循环
- **懒加载**：延迟加载非必要资源
- **防抖节流**：高频操作使用防抖节流

#### 8.1.2 性能优化示例

```typescript
// ✅ 正确示例（缓存）
class UserService {
  private cache: Map<string, User> = new Map();

  async getUserById(userId: string): Promise<User> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }
    const user = await userRepository.findById(userId);
    this.cache.set(userId, user);
    return user;
  }
}

// ✅ 正确示例（批量操作）
async function updateUsers(users: User[]): Promise<void> {
  await userRepository.updateMany(users);
}

// ✅ 正确示例（防抖）
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const debouncedSearch = debounce(searchUsers, 300);

// ❌ 错误示例（循环操作）
async function updateUsers(users: User[]): Promise<void> {
  for (const user of users) {
    await userRepository.update(user);  // N次数据库操作
  }
}
```

### 8.2 内存管理

#### 8.2.1 内存管理规则

- **及时释放**：及时释放不再使用的资源
- **避免泄漏**：避免内存泄漏
- **合理缓存**：合理使用缓存，设置过期时间
- **大对象处理**：大对象使用流式处理

#### 8.2.2 内存管理示例

```typescript
// ✅ 正确示例（及时释放）
async function processLargeFile(filePath: string): Promise<void> {
  const stream = fs.createReadStream(filePath);
  try {
    await processStream(stream);
  } finally {
    stream.destroy();
  }
}

// ✅ 正确示例（缓存过期）
class Cache<T> {
  private data: Map<string, { value: T; expiry: number }> = new Map();

  set(key: string, value: T, ttl: number): void {
    this.data.set(key, {
      value,
      expiry: Date.now() + ttl * 1000
    });
  }

  get(key: string): T | undefined {
    const item = this.data.get(key);
    if (!item || item.expiry < Date.now()) {
      this.data.delete(key);
      return undefined;
    }
    return item.value;
  }
}

// ❌ 错误示例（内存泄漏）
class EventManager {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, listener: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  // 缺少移除监听器的方法
}
```

---

## 九、安全编码规范

### 9.1 输入验证

#### 9.1.1 输入验证规则

- **验证所有输入**：验证所有外部输入
- **白名单机制**：使用白名单验证
- **长度限制**：限制输入长度
- **类型检查**：检查输入类型

#### 9.1.2 输入验证示例

```typescript
// ✅ 正确示例
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validateUserId(userId: string): boolean {
  return /^[a-zA-Z0-9-]{1,50}$/.test(userId);
}

function createUser(input: any): User {
  if (!validateEmail(input.email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
  if (!validateUserId(input.id)) {
    throw new ValidationError('Invalid user ID', 'id');
  }
  return {
    id: input.id,
    email: input.email,
    name: input.name?.substring(0, 100)
  };
}

// ❌ 错误示例
function createUser(input: any): User {
  return {
    id: input.id,
    email: input.email,
    name: input.name
  };
}
```

### 9.2 敏感信息处理

#### 9.2.1 敏感信息规则

- **不记录日志**：不在日志中记录敏感信息
- **不返回前端**：不向前端返回敏感信息
- **加密存储**：敏感信息加密存储
- **脱敏显示**：敏感信息脱敏显示

#### 9.2.2 敏感信息处理示例

```typescript
// ✅ 正确示例
interface User {
  id: string;
  email: string;
  password: string;
  phone: string;
}

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: maskEmail(user.email),
    phone: maskPhone(user.phone)
  };
}

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name.substring(0, 2)}***@${domain}`;
}

function maskPhone(phone: string): string {
  return `${phone.substring(0, 3)}****${phone.substring(7)}`;
}

// ✅ 不记录敏感信息
logger.info('User login', { userId: user.id });  // ✅
logger.info('User login', { user });  // ❌
```

### 9.3 SQL注入防护

#### 9.3.1 SQL注入防护规则

- **参数化查询**：使用参数化查询
- **ORM框架**：使用ORM框架
- **输入验证**：验证SQL输入
- **最小权限**：数据库使用最小权限

#### 9.3.2 SQL注入防护示例

```typescript
// ✅ 正确示例（参数化查询）
async function getUserById(userId: string): Promise<User> {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}

// ✅ 正确示例（ORM框架）
async function getUserById(userId: string): Promise<User> {
  return userRepository.findById(userId);
}

// ❌ 错误示例（字符串拼接）
async function getUserById(userId: string): Promise<User> {
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  const result = await db.query(query);
  return result.rows[0];
}
```

---

## 十、测试编码规范

### 10.1 测试原则

- **单元测试**：每个函数必须有单元测试
- **覆盖率**：测试覆盖率≥80%
- **独立性**：测试之间相互独立
- **可读性**：测试代码清晰易读

### 10.2 测试命名

#### 10.2.1 测试命名规则

- **描述性**：测试名称描述测试场景
- **格式统一**：使用统一的命名格式
- **包含场景**：包含测试的场景和期望

#### 10.2.2 测试命名示例

```typescript
// ✅ 正确示例
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      // 测试代码
    });

    it('should return null when user does not exist', async () => {
      // 测试代码
    });

    it('should throw error when user id is invalid', async () => {
      // 测试代码
    });
  });
});

// ❌ 错误示例
describe('UserService', () => {
  it('test1', async () => {
    // 测试代码
  });

  it('test2', async () => {
    // 测试代码
  });
});
```

### 10.3 测试结构

#### 10.3.1 AAA模式

使用AAA（Arrange-Act-Assert）模式组织测试代码。

```typescript
// ✅ 正确示例（AAA模式）
it('should calculate total price correctly', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 20, quantity: 1 }
  ];

  // Act
  const total = calculateTotalPrice(items);

  // Assert
  expect(total).toBe(40);
});
```

---

## 十一、文档更新记录

| 版本号 | 更新日期 | 更新内容 | 更新人 |
|--------|----------|----------|--------|
| v1.0.0 | 2025-12-25 | 初始版本，创建编码规范手册 | YYC3开发团队 |

---

**文档结束**
