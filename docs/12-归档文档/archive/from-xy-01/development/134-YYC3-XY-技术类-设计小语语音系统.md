# YYC³❤️AI 小语项目 小语语音系统

>「YanYuCloudCube」
>「万象归元于云枢 丨深栈智启新纪元」
>「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」
>「AI Intelligent Programming Development Application Project Delivery Work Instruction」
---

## 目录

- 系统概述
- 核心功能
- 技术架构
- 安装指南
- 使用说明
- API文档
- 动画系统
- 皮肤系统
- 开发指南
- 常见问题
- 更新日志

## 系统概述

小语语音系统是YYC³AI项目的核心情感交互组件，专为小语虚拟角色设计。该系统实现了高度拟人化的语音交互体验，通过多模态情感识别、情感化语音合成、智能语音指令控制等功能，让小语能够自然地与用户进行情感交流。

### 主要特性

- 多模态情感识别：结合文本、语音、面部表情等多维度信息准确识别用户情感状态
- 情感化语音合成：根据情感状态动态调整语音参数，实现富有表现力的语音输出
- 智能语音指令控制：支持自然语言指令控制，可执行复杂操作序列
- 自适应学习：基于用户交互历史持续优化语音交互体验
- 多场景适配：支持不同应用场景下的语音交互模式切换

## 核心功能

### 1. 情感语音合成

```javascript
// 示例：情感化语音合成
const xiaoyuVoice = new XiaoyuVoiceSystem();

// 带情感的语音合成
await xiaoyuVoice.speak(
  "今天天气真好，我们一起出去玩吧！", 
  "happy", 
  0.8
);

// 停止语音播放
await xiaoyuVoice.stopSpeaking();

```

### 2. 语音指令控制

```javascript
// 示例：语音指令处理
const voiceCommand = new VoiceCommandSystem();

// 处理语音指令
const result = await voiceCommand.processVoiceCommand(audioData);
console.log("指令执行结果:", result);

```

### 3. 语音情感识别

```javascript
// 示例：语音情感识别
const emotionRecognizer = new VoiceEmotionRecognizer();

// 识别语音中的情感
const emotion = await emotionRecognizer.recognizeEmotion(audioData);
console.log("识别到的情感:", emotion);

```

## 技术架构

小语语音系统采用模块化架构设计，主要包含以下核心组件：

```plaintext
小语语音系统
├── 语音输入模块
│   ├── 语音识别引擎
│   ├── 情感识别器
│   └── 指令解析器
├── 语音处理模块
│   ├── 语音合成引擎
│   ├── 情感处理器
│   └── 语音增强器
├── 交互控制模块
│   ├── 指令执行器
│   ├── 上下文管理器
│   └── 反馈生成器
└── 适配模块
    ├── 环境适配器
    ├── 用户适配器
    └── 场景适配器

```

## 安装指南

### 环境要求

- Node.js >= 14.0.0
- Python >= 3.8
- Chrome/Firefox/Safari 最新版本
- 支持Web Audio API的现代浏览器

### 安装步骤

1. 克隆项目仓库

```bash
git clone https://github.com/YYC3AI/xiaoyu-voice-system.git
cd xiaoyu-voice-system

```

1. 安装依赖

```bash
npm install

```

1. 初始化系统

```bash
npm run init

```

1. 启动开发服务器

```bash
npm run dev

```

1. 访问应用
    打开浏览器访问<http://localhost:3000>

## 使用说明

### 基础语音交互

1. 点击麦克风图标开始语音输入
2. 清晰地说出指令或问题
3. 系统会自动识别并执行相应操作
4. 小语会通过语音和动画给出回应

### 语音指令示例

|指令类型|示例指令|执行操作|
|-|-|-|
|基础控制|"小语，开始播放音乐"|启动音乐播放|
|情感交互|"小语，开心一点"|表达开心情感|
|信息查询|"小语，现在几点了"|查询当前时间|
|娱乐互动|"小语，讲个故事"|开始讲故事|
|设置调整|"小语，把音量调大一点"|调整系统音量|

            指令类型
            示例指令
            执行操作
            基础控制
            "小语，开始播放音乐"
            启动音乐播放
            情感交互
            "小语，开心一点"
            表达开心情感
            信息查询
            "小语，现在几点了"
            查询当前时间
            娱乐互动
            "小语，讲个故事"
            开始讲故事
            设置调整
            "小语，把音量调大一点"
            调整系统音量

### 高级功能

#### 语音指令链

```javascript
// 示例：执行语音指令链
await voiceCommand.executeCommandChain([
  "开始播放音乐",
  "把音量调到80%",
  "切换到流行音乐列表"
]);

```

#### 自定义语音响应

```javascript
// 示例：自定义语音响应
xiaoyuVoice.setCustomResponse({
  trigger: "你好小语",
  response: "你好呀！今天过得怎么样？",
  emotion: "happy",
  animation: "wave"
});

```

## API文档

### 核心类

#### XiaoyuVoiceSystem

小语语音系统主类，提供语音交互的核心功能。
方法

- initialize() - 初始化语音系统
- speak(text, emotion, intensity) - 语音合成并播放
- stopSpeaking() - 停止语音播放
- listen(options) - 开始语音监听
- stopListening() - 停止语音监听
示例

```javascript
const voiceSystem = new XiaoyuVoiceSystem();
await voiceSystem.initialize();

// 语音合成
await voiceSystem.speak("你好，我是小语！", "happy", 0.7);

// 语音识别
const recognition = await voiceSystem.listen();
console.log(recognition.transcript);

```

#### VoiceCommandSystem

语音指令控制系统，处理用户语音指令。
方法

- processVoiceCommand(audioData) - 处理语音指令
- executeCommand(command) - 执行指令
- registerCommandHandler(command, handler) - 注册指令处理器
示例

```javascript
const commandSystem = new VoiceCommandSystem();

// 注册自定义指令处理器
commandSystem.registerCommandHandler("dance", async (params) => {
  await animationSystem.playAnimation("dance", params.style);
  return { success: true, message: "开始跳舞！" };
});

// 处理语音指令
const result = await commandSystem.processVoiceCommand(audioData);

```

### 事件系统

小语语音系统提供丰富的事件接口，方便开发者监听系统状态。

```javascript
// 监听语音合成开始事件
xiaoyuVoice.on('speakStart', (event) => {
  console.log("语音合成开始:", event.text);
});

// 监听语音识别结果事件
xiaoyuVoice.on('recognitionResult', (result) => {
  console.log("识别结果:", result.transcript);
});

// 监听指令执行完成事件
voiceCommandSystem.on('commandExecuted', (result) => {
  console.log("指令执行完成:", result);
});

```

## 动画系统

小语动画系统提供丰富的角色动画效果，与语音系统紧密集成，实现高度拟人化的表现。

### 动作动画

#### 基础动作

|动作名称|描述|触发条件|参数|
|-|-|-|-|
|idle|待机动画|系统空闲时|speed(0.5-1.5)|
|walk|行走动画|移动指令|speed(0.5-2.0), distance|
|run|跑步动画|快速移动指令|speed(1.5-3.0), distance|
|jump|跳跃动画|跳跃指令|height(0.5-2.0)|
|sit|坐下动画|休息指令|duration|
|stand|站立动画|从坐姿恢复|-|

            动作名称
            描述
            触发条件
            参数
            idle
            待机动画
            系统空闲时
            speed(0.5-1.5)
            walk
            行走动画
            移动指令
            speed(0.5-2.0), distance
            run
            跑步动画
            快速移动指令
            speed(1.5-3.0), distance
            jump
            跳跃动画
            跳跃指令
            height(0.5-2.0)
            sit
            坐下动画
            休息指令
            duration
            stand
            站立动画
            从坐姿恢复
            -

#### 表情动作

|动作名称|描述|触发条件|参数|
|-|-|-|-|
|smile|微笑|积极情感|intensity(0.1-1.0), duration|
|frown|皱眉|消极情感|intensity(0.1-1.0), duration|
|surprise|惊讶|意外情况|intensity(0.1-1.0), duration|
|blink|眨眼|自然反应|interval(1-5秒)|
|nod|点头|同意/肯定|count(1-3), speed|
|shake|摇头|否定/拒绝|count(1-3), speed|

            动作名称
            描述
            触发条件
            参数
            smile
            微笑
            积极情感
            intensity(0.1-1.0), duration
            frown
            皱眉
            消极情感
            intensity(0.1-1.0), duration
            surprise
            惊讶
            意外情况
            intensity(0.1-1.0), duration
            blink
            眨眼
            自然反应
            interval(1-5秒)
            nod
            点头
            同意/肯定
            count(1-3), speed
            shake
            摇头
            否定/拒绝
            count(1-3), speed

#### 交互动作

|动作名称|描述|触发条件|参数|
|-|-|-|-|
|wave|挥手|问候/道别|intensity(0.5-1.0), duration|
|point|指向|指示方向|target, duration|
|clap|鼓掌|赞赏/庆祝|intensity(0.5-1.0), count|
|hug|拥抱|安慰/亲近|intensity(0.5-1.0), duration|
|dance|跳舞|娱乐/庆祝|style('pop', 'classical', 'hiphop'), duration|

            动作名称
            描述
            触发条件
            参数
            wave
            挥手
            问候/道别
            intensity(0.5-1.0), duration
            point
            指向
            指示方向
            target, duration
            clap
            鼓掌
            赞赏/庆祝
            intensity(0.5-1.0), count
            hug
            拥抱
            安慰/亲近
            intensity(0.5-1.0), duration
            dance
            跳舞
            娱乐/庆祝
            style('pop', 'classical', 'hiphop'), duration

#### 特殊动作

|动作名称|描述|触发条件|参数|
|-|-|-|-|
|think|思考|问题处理|intensity(0.3-0.8), duration|
|sleep|睡觉|休息模式|depth('light', 'deep')|
|celebrate|庆祝|成就达成|intensity(0.7-1.0), duration|
|comfort|安慰|用户情绪低落|intensity(0.5-1.0), duration|
|excited|兴奋|高兴情绪|intensity(0.7-1.0), duration|

            动作名称
            描述
            触发条件
            参数
            think
            思考
            问题处理
            intensity(0.3-0.8), duration
            sleep
            睡觉
            休息模式
            depth('light', 'deep')
            celebrate
            庆祝
            成就达成
            intensity(0.7-1.0), duration
            comfort
            安慰
            用户情绪低落
            intensity(0.5-1.0), duration
            excited
            兴奋
            高兴情绪
            intensity(0.7-1.0), duration

### 场景动画

#### 日常场景

|场景名称|描述|适用情境|动画序列|
|-|-|-|-|
|morning_routine|早晨日常|早上问候|wake_up -> stretch -> yawn -> smile -> wave|
|meal_time|用餐时间|用餐提醒|walk_to_table -> sit_down -> pick_up_utensil -> eat -> drink|
|study_time|学习时间|学习模式|sit_down -> open_book -> read -> take_notes -> think|
|exercise_time|运动时间|运动提醒|stretch -> warm_up -> exercise -> cool_down -> stretch|
|bedtime|睡前准备|睡眠模式|yawn -> change_clothes -> brush_teeth -> lie_down -> sleep|

            场景名称
            描述
            适用情境
            动画序列
            morning_routine
            早晨日常
            早上问候
            wake_up -> stretch -> yawn -> smile -> wave
            meal_time
            用餐时间
            用餐提醒
            walk_to_table -> sit_down -> pick_up_utensil -> eat -> drink
            study_time
            学习时间
            学习模式
            sit_down -> open_book -> read -> take_notes -> think
            exercise_time
            运动时间
            运动提醒
            stretch -> warm_up -> exercise -> cool_down -> stretch
            bedtime
            睡前准备
            睡眠模式
            yawn -> change_clothes -> brush_teeth -> lie_down -> sleep

#### 娱乐场景

|场景名称|描述|适用情境|动画序列|
|-|-|-|-|
|music_performance|音乐表演|播放音乐|take_microphone -> sing -> dance -> bow|
|story_telling|讲故事|故事时间|sit_down -> open_book -> gesture -> express_emotion -> close_book|
|game_playing|游戏互动|游戏时间|jump -> run -> celebrate -> think -> react|
|dance_party|舞会派对|庆祝活动|dance -> spin -> clap -> wave -> celebrate|
|magic_show|魔术表演|特殊活动|gesture -> magic_trick -> surprise -> bow -> celebrate|

            场景名称
            描述
            适用情境
            动画序列
            music_performance
            音乐表演
            播放音乐
            take_microphone -> sing -> dance -> bow
            story_telling
            讲故事
            故事时间
            sit_down -> open_book -> gesture -> express_emotion -> close_book
            game_playing
            游戏互动
            游戏时间
            jump -> run -> celebrate -> think -> react
            dance_party
            舞会派对
            庆祝活动
            dance -> spin -> clap -> wave -> celebrate
            magic_show
            魔术表演
            特殊活动
            gesture -> magic_trick -> surprise -> bow -> celebrate

#### 情感场景

|场景名称|描述|适用情境|动画序列|
|-|-|-|-|
|happiness|快乐|积极情绪|jump -> laugh -> dance -> celebrate -> hug|
|sadness|悲伤|消极情绪|cry -> sit_down -> look_down -> comfort -> hug|
|anger|愤怒|生气情绪|stomp -> cross_arms -> frown -> breathe -> calm_down|
|fear|恐惧|害怕情绪|tremble -> hide -> peek -> comfort -> relax|
|surprise|惊讶|意外情况|gasp -> eyes_wide -> jump -> look_around -> react|

            场景名称
            描述
            适用情境
            动画序列
            happiness
            快乐
            积极情绪
            jump -> laugh -> dance -> celebrate -> hug
            sadness
            悲伤
            消极情绪
            cry -> sit_down -> look_down -> comfort -> hug
            anger
            愤怒
            生气情绪
            stomp -> cross_arms -> frown -> breathe -> calm_down
            fear
            恐惧
            害怕情绪
            tremble -> hide -> peek -> comfort -> relax
            surprise
            惊讶
            意外情况
            gasp -> eyes_wide -> jump -> look_around -> react

### 动画控制API

```javascript
// 播放基础动作
await animationSystem.playAnimation('wave', {
  intensity: 0.8,
  duration: 2000
});

// 播放场景动画
await animationSystem.playScene('morning_routine', {
  speed: 1.0,
  loop: false
});

// 组合多个动作
await animationSystem.playAnimationSequence([
  { name: 'wave', duration: 1000 },
  { name: 'smile', duration: 1500 },
  { name: 'nod', duration: 800 }
]);

// 注册自定义动画
animationSystem.registerAnimation('custom_wave', {
  keyframes: [
    { time: 0, pose: 'idle' },
    { time: 0.3, pose: 'arm_up' },
    { time: 0.7, pose: 'arm_down' },
    { time: 1.0, pose: 'idle' }
  ],
  duration: 2000
});

```

## 皮肤系统

小语皮肤系统提供多样化的角色外观定制选项，满足不同场景和用户偏好。

### 基础皮肤

#### 经典系列

|皮肤名称|描述|主题色|适用场景|
|-|-|-|-|
|classic_blue|经典蓝色|#3498db|日常使用|
|classic_pink|经典粉色|#ff69b4|女性用户|
|classic_green|经典绿色|#2ecc71|自然主题|
|classic_purple|经典紫色|#9b59b6|创意场景|

            皮肤名称
            描述
            主题色
            适用场景
            classic_blue
            经典蓝色
            #3498db
            日常使用
            classic_pink
            经典粉色
            #ff69b4
            女性用户
            classic_green
            经典绿色
            #2ecc71
            自然主题
            classic_purple
            经典紫色
            #9b59b6
            创意场景

#### 季节系列

|皮肤名称|描述|主题色|适用场景|
|-|-|-|-|
|spring_blossom|春日花开|#ff9ff3|春季主题|
|summer_breeze|夏日清风|#54a0ff|夏季主题|
|autumn_maple|秋日枫叶|#ff6b6b|秋季主题|
|winter_snow|冬日飘雪|#48dbfb|冬季主题|

            皮肤名称
            描述
            主题色
            适用场景
            spring_blossom
            春日花开
            #ff9ff3
            春季主题
            summer_breeze
            夏日清风
            #54a0ff
            夏季主题
            autumn_maple
            秋日枫叶
            #ff6b6b
            秋季主题
            winter_snow
            冬日飘雪
            #48dbfb
            冬季主题

### 特殊皮肤

#### 节日系列

|皮肤名称|描述|主题色|适用节日|
|-|-|-|-|
|new_year_celebration|新年庆典|#ff3838|新年|
|valentine_sweet|情人甜蜜|#ff4757|情人节|
|halloween_spooky|万圣惊悚|#2f3542|万圣节|
|christmas_joy|圣诞欢乐|#ff6348|圣诞节|

            皮肤名称
            描述
            主题色
            适用节日
            new_year_celebration
            新年庆典
            #ff3838
            新年
            valentine_sweet
            情人甜蜜
            #ff4757
            情人节
            halloween_spooky
            万圣惊悚
            #2f3542
            万圣节
            christmas_joy
            圣诞欢乐
            #ff6348
            圣诞节

#### 职业系列

|皮肤名称|描述|主题色|适用场景|
|-|-|-|-|
|doctor_white|医生白袍|#ffffff|医疗场景|
|teacher_wisdom|教师智慧|#f1c40f|教育场景|
|engineer_blue|工程师蓝|#3498db|技术场景|
|artist_creative|艺术家创意|#e74c3c|创意场景|

            皮肤名称
            描述
            主题色
            适用场景
            doctor_white
            医生白袍
            #ffffff
            医疗场景
            teacher_wisdom
            教师智慧
            #f1c40f
            教育场景
            engineer_blue
            工程师蓝
            #3498db
            技术场景
            artist_creative
            艺术家创意
            #e74c3c
            创意场景

### 皮肤定制

#### 颜色定制

```javascript
// 自定义主题色
skinSystem.setCustomColors({
  primary: '#ff6b6b',
  secondary: '#4ecdc4',
  accent: '#ffe66d',
  background: '#f7f7f7'
});

```

#### 材质定制

```javascript
// 自定义材质
skinSystem.setCustomMaterial({
  type: 'matte',
  roughness: 0.8,
  metalness: 0.2,
  clearcoat: 0.0
});

```

#### 配件定制

```javascript
// 添加配件
skinSystem.addAccessory('glasses', {
  style: 'round',
  color: '#333333',
  position: 'face'
});

skinSystem.addAccessory('hat', {
  style: 'cap',
  color: '#ff6b6b',
  position: 'head'
});

```

### 皮肤控制API

```javascript
// 应用皮肤
await skinSystem.applySkin('classic_blue');

// 获取可用皮肤列表
const skins = await skinSystem.getAvailableSkins();
console.log(skins);

// 创建自定义皮肤
const customSkin = await skinSystem.createCustomSkin({
  name: 'my_custom_skin',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4'
  },
  accessories: ['glasses', 'hat']
});

// 保存皮肤配置
await skinSystem.saveSkinConfiguration('my_config', {
  skin: 'classic_blue',
  accessories: ['glasses'],
  customColors: {
    accent: '#ffe66d'
  }
});

```

## 开发指南

### 环境搭建

1. 安装开发依赖

```bash
npm install --dev

```

1. 启动开发模式

```bash
npm run dev

```

1. 运行测试

```bash
npm test

```

### 自定义语音指令

```javascript
// 创建自定义指令处理器
class CustomCommandHandler {
  async execute(params, context) {
    // 自定义指令逻辑
    return { success: true, message: "自定义指令执行完成" };
  }
}

// 注册自定义指令
voiceCommandSystem.registerCommand('custom_command', new CustomCommandHandler());

```

### 自定义动画

```javascript
// 创建自定义动画
const customAnimation = {
  name: 'custom_dance',
  duration: 3000,
  keyframes: [
    { time: 0, pose: 'idle' },
    { time: 0.25, pose: 'left_arm_up' },
    { time: 0.5, pose: 'right_arm_up' },
    { time: 0.75, pose: 'spin' },
    { time: 1.0, pose: 'idle' }
  ]
};

// 注册自定义动画
animationSystem.registerAnimation('custom_dance', customAnimation);

```

### 自定义皮肤

```javascript
// 创建自定义皮肤
const customSkin = {
  name: 'my_skin',
  baseModel: 'default',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d'
  },
  textures: {
    body: 'textures/custom_body.png',
    face: 'textures/custom_face.png'
  },
  accessories: ['glasses', 'hat']
};

// 注册自定义皮肤
skinSystem.registerSkin('my_skin', customSkin);

```

## 常见问题

### Q: 语音识别不准确怎么办？

A: 可以尝试以下方法：

1. 确保麦克风正常工作
2. 在安静环境下使用
3. 清晰缓慢地说话
4. 使用标准普通话

### Q: 如何提高语音合成质量？

A: 可以通过以下方式优化：

1. 调整语音参数（音调、语速、音量）
2. 添加适当的情感表达
3. 使用高质量的音频设备
4. 优化文本输入（添加标点、分段）

### Q: 动画播放不流畅怎么办？

A: 可能的解决方案：

1. 检查设备性能
2. 降低动画质量设置
3. 关闭不必要的后台应用
4. 更新显卡驱动

### Q: 如何添加新的语音指令？

A: 请参考开发指南中的"自定义语音指令"部分，通过注册新的指令处理器来扩展功能。

## 未来规划

### v2.1.0

- 新增多语言支持
- 优化语音识别准确率
- 添加5个新场景动画
- 修复动画播放卡顿问题

### v2.0.0

- 全新UI界面
- 重构语音指令系统
- 新增皮肤编辑器
- 性能优化提升30%

### v1.5.0

- 新增情感识别功能
- 添加节日系列皮肤
- 支持自定义动画
- 修复已知问题

### v1.0.0

- 初始版本发布
- 基础语音交互功能
- 标准动画系统
- 基础皮肤系统

---

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件
