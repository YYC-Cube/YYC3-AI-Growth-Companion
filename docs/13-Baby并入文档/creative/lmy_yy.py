import os
import json
from datetime import datetime

class GrowthFileTreeGenerator:
    def __init__(self, root_dir="奕贺成长"):
        self.root_dir = root_dir
        self.current_year = datetime.now().year
        # 小龙女沫语相关配置
        self.core_elements = {
            "人物": "小龙女沫语——成长守护体系（射手座）",
            "文化根基": "河洛文化，古都洛阳",
            "核心元素": ["牡丹国色", "言启智云", "语枢未来", "明珠使者", "智能同行"]
        }
        
        # 各年龄段的成长阶段名称
        self.age_stages = {
            1: "1岁启智", 2: "2岁学步", 3: "3岁探索", 4: "4岁发现", 
            5: "5岁准备", 6: "6岁入学", 7: "7岁适应", 8: "8岁成长",
            9: "9岁精研", 10: "10岁拓展", 11: "11岁准备", 12: "12岁入初",
            13: "13岁适应", 14: "14岁成长", 15: "15岁入高", 16: "16岁积淀",
            17: "17岁冲刺", 18: "18岁入大", 19: "19岁探索", 20: "20岁成长",
            21: "21岁毕业"
        }
        
        # 多元角色核心事项
        self.role_core_items = {
            "记录者": {
                "医疗健康档案": ["疫苗接种时间线", "常规体检数据追踪", "常见不适记录", "口腔发育轨迹"],
                "初始冠军珍藏库": ["首次身体控制", "首次语言表达", "首次自主生活技能", "首次社交行为"],
                "成长里程碑矩阵": ["认知发展", "情绪表达", "创造力萌芽", "季节感知"],
                "日常生命韵律": ["阶段性睡眠模式", "饮食偏好变化", "昼夜情绪波动规律"]
            },
            "守护者": {
                "健康生态规划": ["饮食结构日志", "运动发展引导", "睡眠环境优化"],
                "安全防护体系": ["居家安全升级时间线", "外出安全规则建立", "数字安全启蒙"],
                "情绪安全基底": ["分离焦虑缓解记录", "挫折耐受观察", "安全感信号捕捉"]
            },
            "聆听者": {
                "情绪响应日志": ["哭闹背后的语言解码", "开心时刻的深度互动", "负面情绪处理"],
                "兴趣信号捕捉": ["持续关注的高频焦点", "提问记录簿", "拒绝行为解读"],
                "社交互动观察": ["首次与同龄人互动的方式", "冲突处理模式", "合作行为萌芽"]
            },
            "建议者": {
                "成长环境优化建议": ["玩具选择", "活动安排"],
                "兴趣发展支持框架": ["接触体验清单", "技能尝试引导"],
                "抗挫力培养建议": ["失败场景应对", "目标拆解引导"]
            },
            "国粹国学导师": {
                "语言启蒙浸润": ["节气童谣互动", "汉字趣味认知"],
                "传统仪式体验": ["节日家庭活动", "二十四节气物候观察"],
                "礼仪文化渗透": ["日常礼貌自然引导", "家庭伦理体验"]
            }
        }
        
        # 各年龄段的主要发展维度
        self.development_dimensions = {
            "生活": ["日常哺护", "起居训练", "校园作息", "家务参与", "独立出行", "自主规划", "独立生活", "职业准备"],
            "学习": ["感知启蒙", "语言萌芽", "课堂专注", "思维拓展", "学科适应", "学科深化", "专业启蒙", "毕业设计"],
            "自定义": ["健康监测", "社交初验", "规则适应", "团队协作", "自主学习", "生涯初探", "社团参与", "生涯定位"],
            "兴趣爱好发展": ["探索萌芽", "偏好显现", "兴趣聚焦", "能力深化", "能力进阶", "特长形成", "兴趣多元", "兴趣融合"],
            "社交能力发展": ["社交雏形", "互动尝试", "同伴互动", "社交拓展", "社交深化", "社交成熟", "社会交往", "职场社交"],
            "性格特点记录": ["性情初显", "特质萌芽", "性格具象", "特质稳定", "自我认知", "人格稳定", "人格成熟", "人格完整"],
            "交互记录": ["亲子协作", "共同决策", "聆听支持", "支持赋能", "平等对话", "生命对话"],
            "健康关联": ["健康干预", "健康重塑", "健康独立"],
            "里程碑记录": ["首次里程碑", "学步里程碑", "入学里程碑", "深耕里程碑", "初中里程碑", "高中里程碑", "成人里程碑", "毕业里程碑"]
        }
        
        # 小学阶段特殊结构
        self.primary_school_structure = {
            "学科成长": {
                "folder": "学科成长",
                "description": "记录小学阶段各学科成长情况",
                "content": lambda age, year: f"""# {year} 学科成长记录
## 一年级{"上" if age == 6 else "下"}学期
### 语文
- 拼音测试: 92分
- 生字默写: 每周正确率曲线
- 看图写话: 首次获"班级范文"喜报

### 数学
- 10以内加减法口算: 平均速度3秒/题
- 图形认知测试: 满分
- 期末综合评定: A+

### 综合
- 科学课"植物观察"作业: 获"最佳观察奖"
- 班会发言视频: 主题"我的理想"

### 特长技能
- 尤克里里: 首次弹奏完整儿歌《小星星》证书
- 围棋: 入门级考级通过

## AI学科能力雷达图
![学科能力雷达图](学科能力雷达图.png)
"""
            },
            "时光印记": {
                "folder": "时光印记",
                "description": "记录小学阶段的时光印记",
                "content": lambda age, year: f"""# {year} 时光印记
## 四季呵护
### 春季: 春生养护
- 过敏体质监测
- 春游防晒措施
- 生长加速期营养方案

### 夏季: 夏长调适
- 暑期作息表
- 防溺水安全教育记录
- 空调房湿度调节日志

### 秋季: 秋收防护
- 流感疫苗接种
- 秋季腹泻预防
- 秋游衣物穿搭指南

### 冬季: 冬藏滋养
- 室内运动计划
- 防寒保暖习惯养成
- 冬至进补食谱

## 节气守护
### 清明: 踏青记录
- 观察柳树抽芽照片
- 放风筝高度记录: 最高12米

### 夏至: 昼长体验
- 记录"最长白昼"的日出日落时间
- 自制凉面食谱及反馈

### 秋分: 丰收观察
- 收集不同农作物果实照片
- 计算昼夜温差对植物的影响

### 冬至: 夜长活动
- 包饺子过程视频
- 绘制"九九消寒图"每日打卡

## 物候记录
### 植物: 草木日志
- 小区樱花树开花日期: 3月15日
- 爬山虎落叶过程照片

### 动物: 生灵观察
- 燕子筑巢进度
- 金蝉羽化视频
- 冬季麻雀觅食规律

### 气象: 天象笔记
- 首次观察彩虹的时间: 6月12日
- 初雪日期及积雪厚度
"""
            },
            "成长维度": {
                "folder": "成长维度",
                "description": "记录小学阶段的成长维度",
                "content": lambda age, year: f"""# {year} 成长维度
## 兴趣发展
编程: 从Scratch图形化到Python入门的作品迭代集

## 社交进阶
三年级: 主动帮助转学生融入班级
五年级: 组织小组完成科技节项目

## 性格塑造
面对考试失利: 从哭闹到主动分析错题
"""
            }
        }
        
        # 初中阶段特殊结构
        self.junior_high_structure = {
            "学科深耕": {
                "folder": "学科深耕",
                "description": "记录初中阶段各学科深耕情况",
                "content": lambda age, year: f"""# {year} 学科深耕记录
## 初{"一" if age == 12 else "二" if age == 13 else "三"}期中
### 主科
- 语文文言文阅读: 首次翻译《论语》选段获赞
- 数学函数单元测试: 班级排名第5
- 英语听力: 满分记录3次

### 副科
- 物理"电路实验"操作视频: 获"实验室之星"
- 历史"中国近代史时间轴"手绘图: 校级展览

### 跨学科
环保与数学项目报告: 用数据证明垃圾分类的效益，获市级二等奖

### 特长技能
- 编程: Scratch竞赛市级三等奖
- 篮球: 校队选拔赛入选记录

## 中考备考倒计时日历
[中考备考倒计时日历](中考备考倒计时日历.png)
"""
            },
            "自然感知": {
                "folder": "自然感知",
                "description": "记录初中阶段的自然感知",
                "content": lambda age, year: f"""# {year} 自然感知
## 四季呵护
### 春季: 青春期养护
- 生长痛缓解方法
- 情绪波动记录及疏导

### 夏季: 中考体育备战
- 长跑耐力训练数据: 3分45秒→3分20秒
- 体能恢复食谱

### 秋季: 升学适应
- 初三开学焦虑测评
- 作息调整方案

### 冬季: 备考保暖
- 教室座位保暖措施
- 晨读御寒装备清单

## 节气守护
### 芒种: 农趣体验
- 参与学校农场插秧活动
- 记录"汗滴禾下土"的真实感受

### 白露: 物候观察
- 测量晨露温度
- 记录"白露种高山"的农谚实践

### 立冬: 民俗体验
- 学包饺子视频
- 记录"立冬补冬"的家庭传统

## 物候记录
### 校园生态
教学楼前梧桐树的四季变化: 每周拍照存档，生成"树木生长时间轴"

### 城市观察
记录城市公园鸟类种类变化: 发现新增"戴胜鸟"，附观察日记
"""
            },
            "社会连接": {
                "folder": "社会连接",
                "description": "记录初中阶段的社会连接",
                "content": lambda age, year: f"""# {year} 社会连接
## 荣誉档案
- 校级"三好学生"证书: 初一上学期
- 市级"青少年科技创新大赛"二等奖: 初二
- "优秀共青团员"表彰文件

## 实践记录
- 社区志愿服务: 累计时长48小时
- 敬老院慰问表演视频: 钢琴独奏

## 思维成长
- 辩论赛"人工智能利弊"记录: 最佳辩手获奖词
- 时事评论手稿: 主题"碳中和与青少年责任"
"""
            }
        }
        
        # 各年龄段的兴趣延伸
        self.interest_extensions = {
            1: "触感探索", 2: "儿歌跟唱", 3: "涂鸦创作", 4: "故事讲述", 
            5: "手工制作", 6: "尤克里里初弹", 7: "绘画进阶", 8: "科学实验",
            9: "手工创客", 10: "模型制作", 11: "乐器演奏", 12: "编程启蒙",
            13: "体育爱好", 14: "艺术创作", 15: "英语演讲", 16: "科技创新",
            17: "社会实践", 18: "摄影入门", 19: "旅行记录", 20: "志愿服务",
            21: "简历优化"
        }
        
        # 各年龄段的生日纪念
        self.birthday_celebrations = {
            1: "二月马・周岁欢", 2: "二月马・学步礼", 3: "二月马・探索宴", 
            4: "二月马・发现乐", 5: "二月马・准备颂", 6: "二月马・入学贺",
            7: "二月马・适应庆", 8: "二月马・成长祭", 9: "二月马・精研礼",
            10: "二月马・拓展颂", 11: "二月马・准备宴", 12: "二月马・入初贺",
            13: "二月马・适应庆", 14: "二月马・成长祭", 15: "二月马・入高贺",
            16: "二月马・积淀颂", 17: "二月马・冲刺宴", 18: "二月马・成人贺",
            19: "二月马・探索乐", 20: "二月马・成长礼", 21: "二月马・毕业贺"
        }
    
    def generate_file_tree(self):
        """生成完整的成长文件树"""
        # 创建根目录
        self._create_directory(self.root_dir)
        
        # 创建核心信息文件
        self._create_core_info_file()
        
        # 为每个年龄段创建文件夹和文件
        for age in self.age_stages:
            self._generate_age_directory(age)
        
        # 创建全局信息文件
        self._create_global_info_files()
        
        print(f"成功生成'奕贺成长'文件树，根目录为: {os.path.abspath(self.root_dir)}")
    
    def _create_core_info_file(self):
        """创建核心信息文件"""
        file_path = os.path.join(self.root_dir, "核心信息.md")
        content = f"""# 小龙女沫语成长守护体系
## 核心人物
{self.core_elements['人物']}

## 文化根基
{self.core_elements['文化根基']}

## 核心元素
- {self.core_elements['核心元素'][0]}
- {self.core_elements['核心元素'][1]}
- {self.core_elements['核心元素'][2]}
- {self.core_elements['核心元素'][3]}
- {self.core_elements['核心元素'][4]}

## 多元角色核心事项概述
记录者：时光的忠实存档者，聚焦"唯一性"
守护者：科学边界的构建者，聚焦"适度性"
聆听者：平等对话的发起者，聚焦"尊重感"
建议者：选项的多元提供者，聚焦"自主性"
国粹国学导师：文化根脉的浸润者，聚焦"自然性"

## 核心原则：科技与人文的平衡
- 记录工具：用智能设备高效存档，但每月手写1篇"成长手札"
- 数字边界：AI可辅助分析成长数据，但最终决策基于孩子真实状态
- 时光锚点：每年生日将"年度成长关键词"刻在专属纪念物上
"""
        self._write_file(file_path, content)
    
    def _generate_age_directory(self, age):
        """为指定年龄生成文件夹和文件"""
        age_dir_name = f"{age}岁_{self.age_stages[age]}"
        age_dir_path = os.path.join(self.root_dir, age_dir_name)
        self._create_directory(age_dir_path)
        
        # 创建年度总结文件
        self._create_age_summary_file(age, age_dir_path)
        
        # 创建多元角色核心事项文件夹
        self._create_role_core_items(age, age_dir_path)
        
        # 小学阶段特殊处理
        if 6 <= age <= 11:
            self._generate_primary_school_structure(age, age_dir_path)
        
        # 初中阶段特殊处理
        if 12 <= age <= 14:
            self._generate_junior_high_structure(age, age_dir_path)
        
        # 创建各维度文件夹和文件
        for dimension, subcategories in self.development_dimensions.items():
            # 只创建该年龄段相关的维度文件夹
            if self._is_dimension_applicable(age, dimension):
                dimension_dir = os.path.join(age_dir_path, dimension)
                self._create_directory(dimension_dir)
                
                # 创建子类别文件夹和文件
                for subcategory in subcategories:
                    if self._is_subcategory_applicable(age, dimension, subcategory):
                        sub_dir = os.path.join(dimension_dir, subcategory)
                        self._create_directory(sub_dir)
                        self._create_subcategory_files(age, dimension, subcategory, sub_dir)
        
        # 创建兴趣延伸文件夹
        if age in self.interest_extensions:
            interest_dir = os.path.join(age_dir_path, f"兴趣延伸_{self.interest_extensions[age]}")
            self._create_directory(interest_dir)
            self._create_interest_files(age, interest_dir)
        
        # 创建生日纪念文件夹
        if age in self.birthday_celebrations:
            birthday_dir = os.path.join(age_dir_path, f"生日纪念_{self.birthday_celebrations[age]}")
            self._create_directory(birthday_dir)
            self._create_birthday_files(age, birthday_dir)
        
        # 特殊年龄段的提醒
        if age == 6:
            self._create_directory(os.path.join(age_dir_path, "入学准备"))
        if age == 12:
            self._create_directory(os.path.join(age_dir_path, "中考冲刺"))
    
    def _create_directory(self, dir_path):
        """创建目录"""
        try:
            os.makedirs(dir_path, exist_ok=True)
            print(f"创建目录: {dir_path}")
        except Exception as e:
            print(f"创建目录失败 {dir_path}: {e}")
    
    def _write_file(self, file_path, content):
        """写入文件"""
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"创建文件: {file_path}")
        except Exception as e:
            print(f"创建文件失败 {file_path}: {e}")
    
    def _create_age_summary_file(self, age, age_dir_path):
        """创建年龄总结文件"""
        year = self.current_year + age - 1
        file_path = os.path.join(age_dir_path, f"{age}岁年度总结.md")
        content = f"""# {age}岁成长总结 ({year}年)

## 成长阶段：{self.age_stages[age]}

## 年度关键词
[待填写]

## 主要成长里程碑
- 里程碑1：[待记录]
- 里程碑2：[待记录]
- 里程碑3：[待记录]

## 兴趣发展
当前主要兴趣：{self.interest_extensions.get(age, '探索中')}

## 年度总结
[待填写年度成长总结]
"""
        self._write_file(file_path, content)
    
    def _create_role_core_items(self, age, age_dir_path):
        """创建多元角色核心事项文件夹"""
        for role, items in self.role_core_items.items():
            role_dir = os.path.join(age_dir_path, f"多元角色_{role}")
            self._create_directory(role_dir)
            
            # 为每个核心事项创建文件
            for item_name, sub_items in items.items():
                item_file = os.path.join(role_dir, f"{item_name}.md")
                content = f"# {item_name}\n\n"
                for sub_item in sub_items:
                    content += f"## {sub_item}\n[待记录]\n\n"
                self._write_file(item_file, content)
    
    def _generate_primary_school_structure(self, age, age_dir_path):
        """生成小学阶段特殊结构"""
        year = self.current_year + age - 1
        for structure_name, structure_info in self.primary_school_structure.items():
            structure_dir = os.path.join(age_dir_path, structure_info["folder"])
            self._create_directory(structure_dir)
            
            file_path = os.path.join(structure_dir, f"{structure_name}.md")
            content = structure_info["content"](age, year)
            self._write_file(file_path, content)
    
    def _generate_junior_high_structure(self, age, age_dir_path):
        """生成初中阶段特殊结构"""
        year = self.current_year + age - 1
        for structure_name, structure_info in self.junior_high_structure.items():
            structure_dir = os.path.join(age_dir_path, structure_info["folder"])
            self._create_directory(structure_dir)
            
            file_path = os.path.join(structure_dir, f"{structure_name}.md")
            content = structure_info["content"](age, year)
            self._write_file(file_path, content)
    
    def _is_dimension_applicable(self, age, dimension):
        """判断维度是否适用于该年龄段"""
        # 所有维度都适用，可以根据需要调整逻辑
        return True
    
    def _is_subcategory_applicable(self, age, dimension, subcategory):
        """判断子类别是否适用于该年龄段"""
        # 简单实现：根据年龄段选择合适的子类别
        dimension_list = self.development_dimensions[dimension]
        if age <= 3:
            return subcategory in dimension_list[:2]
        elif age <= 6:
            return subcategory in dimension_list[:3]
        elif age <= 11:
            return subcategory in dimension_list[:4]
        elif age <= 14:
            return subcategory in dimension_list[:6]
        elif age <= 17:
            return subcategory in dimension_list[:7]
        else:
            return True
    
    def _create_subcategory_files(self, age, dimension, subcategory, sub_dir):
        """创建子类别文件"""
        file_path = os.path.join(sub_dir, f"{subcategory}.md")
        content = f"""# {subcategory}

## {age}岁阶段特点
[记录{age}岁在{subcategory}方面的发展特点]

## 记录内容
[详细记录相关发展情况]

## 观察要点
[记录观察到的重要发展信号]

## 家长反思
[记录家长的观察和思考]
"""
        self._write_file(file_path, content)
    
    def _create_interest_files(self, age, interest_dir):
        """创建兴趣延伸文件"""
        interest_name = self.interest_extensions[age]
        file_path = os.path.join(interest_dir, f"{interest_name}_记录.md")
        content = f"""# {interest_name} 兴趣发展记录

## 兴趣萌芽
[记录兴趣如何开始萌芽]

## 发展过程
[记录兴趣发展的具体过程]

## 成果展示
[记录在该兴趣方面的成果]

## 未来规划
[对该兴趣未来发展的规划]
"""
        self._write_file(file_path, content)
    
    def _create_birthday_files(self, age, birthday_dir):
        """创建生日纪念文件"""
        celebration_name = self.birthday_celebrations[age]
        file_path = os.path.join(birthday_dir, f"{celebration_name}.md")
        content = f"""# {celebration_name}

## 生日主题
{celebration_name}

## 庆祝活动
[记录生日庆祝活动的具体内容]

## 成长感悟
[记录在这一年龄段的成长感悟]

## 珍贵时刻
[记录生日当天的珍贵时刻]

## 心愿清单
[记录{age}岁的心愿和期望]
"""
        self._write_file(file_path, content)
    
    def _create_global_info_files(self):
        """创建全局信息文件"""
        # 创建成长时间轴文件
        timeline_path = os.path.join(self.root_dir, "成长时间轴.md")
        timeline_content = """# 小龙女沫语成长时间轴

## 成长阶段概览
"""
        for age, stage in self.age_stages.items():
            timeline_content += f"- {age}岁：{stage}\n"
        
        timeline_content += """

## 重要里程碑
[记录重要的成长里程碑]

## 成长轨迹
[记录整体成长轨迹和趋势]
"""
        self._write_file(timeline_path, timeline_content)
        
        # 创建家庭教育理念文件
        philosophy_path = os.path.join(self.root_dir, "家庭教育理念.md")
        philosophy_content = """# 家庭教育理念

## 核心理念
基于小龙女沫语的成长守护体系，融合传统文化与现代教育

## 教育原则
1. 尊重孩子的天性和个性
2. 注重品格培养和文化传承
3. 平衡科技应用与人文关怀
4. 培养独立思考和创新能力

## 教育方法
[记录具体的教育方法和实践]
"""
        self._write_file(philosophy_path, philosophy_content)
