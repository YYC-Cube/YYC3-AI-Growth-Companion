#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from datetime import datetime

# 定义成长阶段和文件夹结构（名称统一为4个字）
folder_structure = {
    "胎儿时期": ["产检记录", "孕期影像", "胎教内容", "孕母日记"],
    "新生时期": ["日常护理", "健康档案", "成长留影", "脐带护理"],
    "婴儿时期": ["喂养记录", "疫苗接种", "发育指标", "早教活动"],
    "幼儿时期": ["语言发展", "认知能力", "社交互动", "兴趣萌芽"],
    "学前时期": ["入学准备", "安全教育", "习惯养成", "亲子游戏"],
    "小学时期": ["学业记录", "课外实践", "成绩档案", "教师评语"],
    "中学时期": ["学科笔记", "考试成绩", "社会实践", "升学规划"],
    "大学时期": ["专业学习", "实习经历", "职业规划", "毕业准备"]
}

def generate_phase_message(phase):
    """根据不同阶段生成对应的寄语"""
    messages = {
        "胎儿时期": "小小的你在妈妈肚子里慢慢长大，每一次胎动都让我们满心欢喜。期待与你相见的那一天，我们已经为你准备好满满的爱与守护。",
        "新生时期": "你终于来到这个世界，第一声啼哭像天使的号角。粉嫩的小手小脚，均匀的呼吸声，都是生命最纯粹的馈赠。愿你在温暖中安稳成长。",
        "婴儿时期": "从翻身到爬行，从咿呀学语到叫出第一声「爸妈」，你的每一个进步都刻在我们心上。这个世界有太多美好，等你来一一探索。",
        "幼儿时期": "你开始奔跑、跳跃，用好奇的眼睛打量世界，用稚嫩的语言表达想法。社交的种子悄悄发芽，兴趣的火花慢慢点燃，这是充满活力的成长阶段。",
        "学前时期": "即将踏入集体生活的你，像一只准备展翅的小鸟。习惯的养成是飞翔的翅膀，安全的认知是避风的港湾，愿你带着勇气和智慧迎接新旅程。",
        "小学时期": "知识的海洋向你敞开大门，课堂上的专注、操场上的欢笑、伙伴间的友谊，都是这段时光的珍贵注脚。保持好奇，慢慢书写属于你的精彩。",
        "中学时期": "青春期的你开始有了自己的思考，像一株努力向上的小树。学业的挑战、社交的困惑、梦想的萌芽，都是成长的必经之路，我们会做你最坚实的后盾。",
        "大学时期": "你终于长成可以独立飞翔的模样，专业的深耕、社会的历练、未来的规划，都在为人生大厦添砖加瓦。大胆去闯，家永远是你归来的港湾。"
    }
    return messages.get(phase, "记录成长的每一个精彩瞬间")

def create_templates(folder_path, phase):
    """为不同阶段生成记录模板"""
    # 检查文件夹是否存在
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # 避免覆盖已有文件
    def safe_create_file(file_path, content):
        if not os.path.exists(file_path):
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
    
    if "婴儿时期" in phase:
        # 婴儿期专属模板：首次事件记录表
        safe_create_file(os.path.join(folder_path, "首次事件记录模板.txt"), 
                        "日期：\n事件：（如第一次翻身/第一次笑出声）\n场景：\n表现：（表情/动作/声音）\n家长感受：\n备注：\n")
        # 喂养记录模板
        safe_create_file(os.path.join(folder_path, "喂养记录模板.txt"), 
                        "日期 | 时间 | 食物/奶量 | 进食状态 | 排便情况\n"
                        "-----|-----|---------|---------|---------\n"
                        "     |     |         |         |         \n")
    
    elif "小学时期" in phase:
        # 小学阶段：周成长小结模板
        safe_create_file(os.path.join(folder_path, "周成长小结模板.txt"), 
                        "本周日期：____年__月__日 至 ____年__月__日\n"
                        "1. 最开心的事：\n"
                        "2. 遇到的小挑战：\n"
                        "3. 学会的新技能：\n"
                        "4. 想对爸妈说的话：\n"
                        "5. 下周小目标：\n")
    
    elif "幼儿时期" in phase:
        # 幼儿期：语言发展记录表
        safe_create_file(os.path.join(folder_path, "语言发展记录.txt"), 
                        "日期：\n新学会的词汇：（至少3个）\n能说的完整句子：\n有趣的表达/童言童语：\n沟通中的小进步：\n")
        # 社交互动记录
        safe_create_file(os.path.join(folder_path, "社交互动记录.txt"), 
                        "日期：\n互动对象：\n互动场景：\n表现与反应：\n值得鼓励的行为：\n可引导的方向：\n")
    
    elif "中学时期" in phase:
        # 中学阶段：月度反思模板
        safe_create_file(os.path.join(folder_path, "月度成长反思.txt"), 
                        "月份：____年__月\n"
                        "1. 学业收获：\n"
                        "2. 人际关系变化：\n"
                        "3. 遇到的主要挑战及应对：\n"
                        "4. 情绪波动与调节方式：\n"
                        "5. 下月计划：\n")

def add_sync_guide(main_path):
    """生成云同步指南文件"""
    guide = """【沫语成长记录云同步指南】

📁 备份策略：
1. 推荐使用iCloud/阿里云盘自动同步此文件夹，开启"增量同步"节省空间
2. 每月1日手动备份至移动硬盘（命名格式：202X年X月-沫语成长备份）
3. 重要照片/视频单独创建加密相册，密码提示：沫语的生日月份+对应节气（如3月春分）

🔒 安全提醒：
- 每季度检查一次云端同步完整性，重点核对"首次事件""成长里程碑"等关键记录
- 敏感信息（如体检报告）建议加密存储，可使用系统自带加密功能
- 视频文件建议压缩后保存，推荐格式：MP4（分辨率1080P以内）

📝 使用建议：
- 每个阶段结束后（如小学毕业），整理一份"阶段成长手册"（可打印成册）
- 照片按"事件+日期"命名（如：202X0601-儿童节表演），便于后期检索
- 每年生日当天，从各文件夹选取1-2件代表性记录，制作"年度成长记忆"

⏰ 定期维护：
- 每月：清理重复文件，补充当月记录
- 每季度：检查模板使用情况，按需更新
- 每年：完整备份一次，归档旧数据
"""
    guide_path = os.path.join(main_path, "云同步指南.txt")
    if not os.path.exists(guide_path):
        with open(guide_path, "w", encoding="utf-8") as f:
            f.write(guide)

def create_folder_structure(main_path):
    """创建完整的文件夹结构"""
    # 创建主文件夹
    if not os.path.exists(main_path):
        os.makedirs(main_path)
        print(f"📁 创建主文件夹: {main_path}")
    
    # 创建阶段文件夹
    for phase, subfolders in folder_structure.items():
        phase_path = os.path.join(main_path, phase)
        if not os.path.exists(phase_path):
            os.makedirs(phase_path)
            print(f"📂 创建阶段文件夹: {phase}")
        
        # 创建寄语文件
        message_path = os.path.join(phase_path, "阶段寄语.txt")
        if not os.path.exists(message_path):
            with open(message_path, "w", encoding="utf-8") as f:
                f.write(generate_phase_message(phase))
        
        # 创建子文件夹
        for subfolder in subfolders:
            sub_path = os.path.join(phase_path, subfolder)
            if not os.path.exists(sub_path):
                os.makedirs(sub_path)

def create_readme(main_path):
    """创建README说明文件"""
    readme_content = f"""# 沫语成长记录体系

## 📅 创建时间
{datetime.now().strftime('%Y年%m月%d日 %H:%M:%S')}

## 🌟 项目简介
本体系用于系统记录沫语从胎儿到大学的成长轨迹，包含8个核心阶段，每个阶段均设置专属记录维度，兼顾数据化与情感化记录，最终形成可传承的成长档案。

## 📋 阶段说明
| 阶段名称 | 时间范围 | 核心记录重点 |
|---------|---------|------------|
| 胎儿时期 | 孕期 | 产检数据、胎动记录、胎教互动 |
| 新生时期 | 0-28天 | 生理指标、喂养频率、初乳记录 |
| 婴儿时期 | 1-12月 | 发育里程碑、疫苗接种、辅食添加 |
| 幼儿时期 | 1-3岁 | 语言爆发、大运动发展、社交启蒙 |
| 学前时期 | 3-6岁 | 习惯养成、入园适应、兴趣探索 |
| 小学时期 | 6-12岁 | 学业基础、集体生活、个性发展 |
| 中学时期 | 12-18岁 | 学科深耕、青春期变化、自主规划 |
| 大学时期 | 18-22岁 | 专业成长、社会历练、职业探索 |

## 📝 使用规范
1. 记录原则：真实、客观、及时，兼顾量化数据与质性描述
2. 内容要求：每个"首次事件"需记录具体日期、场景、细节反应
3. 媒介形式：文字记录+照片/视频+实物扫描件（如奖状、作品）
4. 隐私保护：18岁后可由沫语自主决定记录的公开范围

## 🔧 维护指南
- 新增记录时，优先使用各阶段提供的模板，保持格式统一
- 每年进行一次"成长复盘"，对比阶段性目标与实际发展
- 技术更新时（如更换设备），及时迁移记录并验证完整性

## ❤️ 家长寄语
时光荏苒，成长不居。这套记录不是束缚你的框架，而是见证你独一无二的证明。愿你长大后翻看时，能感受到我们始终如一的爱——既尊重你的节奏，也为你托举翅膀。

---
💝 用心记录，用爱陪伴，让成长有迹可循
"""
    
    readme_path = os.path.join(main_path, "README.md")
    if not os.path.exists(readme_path):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(readme_content)

# 主程序
if __name__ == "__main__":
    print("🌸 沫语成长记录体系创建器 🌸")
    print("=" * 40)
    
    main_folder = "沫语成长"  # 主文件夹统一为4个字
    main_path = os.path.join(os.getcwd(), main_folder)
    
    # 步骤1：创建文件夹结构
    print("📁 正在创建文件夹结构...")
    create_folder_structure(main_path)
    
    # 步骤2：生成模板文件
    print("📝 正在生成记录模板...")
    for phase in folder_structure.keys():
        phase_path = os.path.join(main_path, phase)
        create_templates(phase_path, phase)
    
    # 步骤3：添加云同步指南
    print("☁️ 正在生成云同步指南...")
    add_sync_guide(main_path)
    
    # 步骤4：创建README文件
    print("📄 正在创建说明文档...")
    create_readme(main_path)
    
    print("=" * 40)
    print(f"✅ 沫语专属成长记录体系创建完成！")
    print(f"📍 文件夹位置：{main_path}")
    print("🎉 开始记录美好的成长时光吧！")