import os
import json
from datetime import datetime

# ===================== 核心配置 =====================
class MuyuGrowthSystem:
    def __init__(self, root_dir="沫语成长守护体系"):
        self.root_dir = root_dir
        self.current_year = datetime.now().year
        self.core_elements = {
            "人物": "小龙女沫语（射手座·成长守护使）",
            "文化基底": "河洛文化·古都洛阳",
            "文化符号": ["牡丹国色", "言启智云", "语枢未来", "明珠使者", "智能同行", "河洛新章"],
            "age_stages": {
                0: "0岁_启元初绽", 1: "1岁_萌智初醒", 2: "2岁_学步观春", 
                3: "3岁_探趣洛城", 4: "4岁_言启智云", 5: "5岁_语枢萌芽", 
                6: "6岁_入学明礼", 7: "7岁_学科启途", 8: "8岁_兴趣深耕", 
                9: "9岁_河洛少年", 10: "10岁_智能同行", 11: "11岁_未来雏型", 
                12: "12岁_初中文枢", 13: "13岁_青春履新", 14: "14岁_牡丹韶华", 
                15: "15岁_高中进阶", 16: "16岁_志向明途", 17: "17岁_冲刺征途", 
                18: "18岁_成人礼赞", 19: "19岁_大学新章", 20: "20岁_社会洞察", 
                21: "21岁_毕业启程"
            },
            # 各年龄段合理分类（规避低龄不合理项）
            "development_dimensions": {
                "0-3岁": ["感知启蒙舱", "亲子共育录", "河洛自然志", "健康守护站", "生日纪念册"],
                "4-6岁": ["语枢启蒙舱", "兴趣探索舱", "社交萌芽社", "健康成长舱", "河洛文化廊"],
                "7-12岁": ["学科启智云", "兴趣深耕坊", "社交成长营", "健康护航队", "国学传承阁"],
                "13-18岁": ["青春赋能站", "学科冲刺舱", "社会洞察社", "生涯探索局", "智能同行舰"],
                "19-21岁": ["大学启航港", "职业探索舱", "独立成长录", "生涯锚定台", "河洛新青年"]
            },
            # 多元角色核心事项（按年龄分层）
            "role_tasks": {
                "记录者": {
                    "0-3岁": ["初绽成长志", "健康萌芽录", "亲子互动影", "河洛初印象"],
                    "4-6岁": ["语枢成长志", "兴趣探索志", "社交萌芽志", "国色观察志"],
                    "7+": ["学科深耕志", "能力雷达图", "荣誉区块链", "智能成长志"]
                },
                "守护者": {
                    "0-3岁": ["健康防护盾", "安全启蒙课", "睡眠成长舱", "营养守护站"],
                    "4+": ["健康护航舰", "安全实践录", "情绪守护舱", "智能护眼室"]
                },
                "国学导师": {
                    "0-3岁": ["河洛童谣集", "节气互动录", "国色自然志"],
                    "4+": ["汉字启蒙舱", "节气实践志", "牡丹文化阁", "礼仪传承录"]
                },
                "智能助手": {
                    "0-6岁": ["成长雷达图", "亲子互动分析", "健康预警"],
                    "7-12岁": ["学科分析报告", "兴趣智能推荐", "AI学习伙伴"],
                    "13+": ["生涯发展规划", "职业倾向测评", "智能决策支持"]
                }
            },
            # 文件夹命名库（4-5字核心词，融入文化符号）
            "folder_naming": {
                "感知": "语枢启蒙舱", "健康": "河洛护航站", "亲子": "明珠共育廊",
                "兴趣": "牡丹探索局", "社交": "言启同行社", "学科": "智云学科舱",
                "国学": "河洛传承阁", "智能": "未来智枢台", "生涯": "锚定启航港",
                "情绪": "心灵守护舱", "艺术": "国色艺境坊", "科技": "智能创想营"
            }
        }

    # ===================== 生成文件树 =====================
    def generate_growth_tree(self):
        """生成完整成长文件树（按年龄分层修正）"""
        self._create_dir(self.root_dir)
        self._create_core_info_file()  # 根目录写入文化基底
        
        # 按年龄分层生成（0-3岁/4-6岁/7+）
        for age in self.core_elements["age_stages"]:
            age_dir = f"{self.core_elements['age_stages'][age]}"
            age_path = os.path.join(self.root_dir, age_dir)
            self._create_dir(age_path)
            
            # 写入年度总结（带文化寄语）
            self._write_file(
                os.path.join(age_path, f"{age}岁_年度成长志.md"),
                self._get_annual_summary(age)
            )
            
            # 按年龄分层配置文件夹
            if 0 <= age <= 3:
                self._generate_0_3(age, age_path)
            elif 4 <= age <= 6:
                self._generate_4_6(age, age_path)
            elif 7 <= age <= 12:
                self._generate_7_12(age, age_path)
            elif 13 <= age <= 18:
                self._generate_teen(age, age_path)
            else:
                self._generate_adult(age, age_path)  # 19岁+
        
        print(f"✨ 沫语成长体系生成完成！路径：{os.path.abspath(self.root_dir)}")

    # ===================== 年龄分层逻辑 =====================
    def _generate_0_3(self, age, path):
        """0-3岁：聚焦感知、亲子、健康（规避超龄分类）"""
        layers = {
            "感知启蒙": self.core_elements["folder_naming"]["感知"],
            "亲子互动": self.core_elements["folder_naming"]["亲子"],
            "健康守护": self.core_elements["folder_naming"]["健康"],
            "河洛初印象": "河洛自然志"  # 融入文化观察
        }
        for layer, dir_name in layers.items():
            dir_path = os.path.join(path, dir_name)
            self._create_dir(dir_path)
            self._write_file(
                os.path.join(dir_path, f"{layer}_成长录.md"),
                self._get_0_3_content(layer, age)
            )
        
        # 创建多元角色文件夹
        self._create_role_folders(age, path, ["记录者", "守护者", "国学导师"])

    def _generate_4_6(self, age, path):
        """4-6岁：引入社交萌芽、语枢启蒙、河洛文化实践"""
        layers = {
            "语枢启蒙": self.core_elements["folder_naming"]["感知"],
            "兴趣探索": self.core_elements["folder_naming"]["兴趣"],
            "社交萌芽": self.core_elements["folder_naming"]["社交"],
            "国学浸润": self.core_elements["folder_naming"]["国学"]
        }
        for layer, dir_name in layers.items():
            dir_path = os.path.join(path, dir_name)
            self._create_dir(dir_path)
            self._write_file(
                os.path.join(dir_path, f"{layer}_成长录.md"),
                self._get_4_6_content(layer, age)
            )
        
        # 创建多元角色文件夹
        self._create_role_folders(age, path, ["记录者", "守护者", "国学导师", "智能助手"])

    def _generate_7_12(self, age, path):
        """7-12岁：学科深耕、兴趣拓展、社交进阶"""
        layers = {
            "学科启智": self.core_elements["folder_naming"]["学科"],
            "兴趣深耕": self.core_elements["folder_naming"]["兴趣"],
            "社交成长": self.core_elements["folder_naming"]["社交"],
            "国学传承": self.core_elements["folder_naming"]["国学"],
            "智能同行": self.core_elements["folder_naming"]["智能"]
        }
        for layer, dir_name in layers.items():
            dir_path = os.path.join(path, dir_name)
            self._create_dir(dir_path)
            self._write_file(
                os.path.join(dir_path, f"{layer}_成长录.md"),
                self._get_7_12_content(layer, age)
            )
        
        # 创建多元角色文件夹
        self._create_role_folders(age, path, ["记录者", "守护者", "国学导师", "智能助手"])

    def _generate_teen(self, age, path):
        """13-18岁：青春期发展、学科冲刺、生涯探索"""
        layers = {
            "青春赋能": "未来智枢台",
            "学科冲刺": "智云学科舱",
            "生涯探索": "锚定启航港",
            "社会洞察": "言启同行社",
            "河洛新青年": "河洛传承阁"
        }
        for layer, dir_name in layers.items():
            dir_path = os.path.join(path, dir_name)
            self._create_dir(dir_path)
            self._write_file(
                os.path.join(dir_path, f"{layer}_成长录.md"),
                self._get_teen_content(layer, age)
            )
        
        # 创建多元角色文件夹
        self._create_role_folders(age, path, ["记录者", "守护者", "国学导师", "智能助手"])

    def _generate_adult(self, age, path):
        """19-21岁：成年期发展、职业准备、社会融入"""
        layers = {
            "大学启航": "大学启航港",
            "职业探索": "锚定启航港",
            "独立成长": "明珠共育廊",
            "社会融入": "言启同行社",
            "文化传承": "河洛传承阁"
        }
        for layer, dir_name in layers.items():
            dir_path = os.path.join(path, dir_name)
            self._create_dir(dir_path)
            self._write_file(
                os.path.join(dir_path, f"{layer}_成长录.md"),
                self._get_adult_content(layer, age)
            )
        
        # 创建多元角色文件夹
        self._create_role_folders(age, path, ["记录者", "守护者", "国学导师", "智能助手"])

    # ===================== 角色文件夹生成 =====================
    def _create_role_folders(self, age, path, roles):
        """创建多元角色文件夹"""
        for role in roles:
            role_dir = os.path.join(path, f"{role}日志")
            self._create_dir(role_dir)
            
            # 根据年龄阶段获取角色任务
            age_group = self._get_age_group(age)
            if role in self.core_elements["role_tasks"] and age_group in self.core_elements["role_tasks"][role]:
                for task in self.core_elements["role_tasks"][role][age_group]:
                    self._write_file(
                        os.path.join(role_dir, f"{task}.md"),
                        self._get_role_task_content(role, task, age)
                    )

    def _get_age_group(self, age):
        """确定年龄所属分组"""
        if 0 <= age <= 3:
            return "0-3岁"
        elif 4 <= age <= 6:
            return "4-6岁"
        elif 7 <= age <= 12:
            return "7+"
        elif 13 <= age <= 18:
            return "13+"
        else:
            return "19+"

    # ===================== 内容生成（文化融入） =====================
    def _get_0_3_content(self, layer, age):
        """0-3岁内容（感知/亲子/健康）"""
        culture_map = {
            "感知启蒙": f"""# 语枢启蒙舱·{age}岁
记录「{self.core_elements['文化_symbols'][0]}」色卡观察、亲子童谣互动（如《牡丹初绽》手势儿歌）。
- **本月重点**：{self._get_monthly_focus(age, "感知")}
- **成长记录**：
  - 视觉追踪：红球、黑白色卡
  - 听觉反应：对妈妈声音的微笑反应
  - 触觉探索：不同材质抚触（丝绸、麻布、海绵）""",
            "亲子互动": f"""# 明珠共育廊·{age}岁
河洛文化初体验：洛阳民俗亲子游戏（如「牡丹拼图」）、节气手作（春分纸鸢）。
- **节气活动**：{self._get_solar_term_activity(age)}
- **亲子游戏**：
  - 0-1岁：「躲猫猫」视觉追踪
  - 1-2岁：「洛阳方言学习」简单词汇模仿
  - 2-3岁：「牡丹花瓣分类」颜色认知""",
            "健康守护": f"""# 河洛护航站·{age}岁
健康记录：疫苗时间轴、过敏监测（牡丹季防护）、成长曲线（附河洛儿童均值对比）。
- **疫苗计划**：{self._get_vaccine_plan(age)}
- **健康监测**：
  - 身高/体重：{self._get_growth_standard(age)}
  - 睡眠模式：夜间连续睡眠时长
  - 过敏记录：春季花粉过敏预防""",
            "河洛初印象": f"""# 河洛自然志·{age}岁
自然观察：王城公园牡丹初开记录、洛河四季水位变化（亲子徒步日志）。
- **季节探索**：{self._get_seasonal_exploration(age)}
- **文化印记**：
  - 第一次看到牡丹：颜色/形状描述
  - 洛河河畔踩水体验
  - 冬季第一场雪的触感记录"""
        }
        return culture_map.get(layer, "# 成长记录待填充")

    def _get_4_6_content(self, layer, age):
        """4-6岁内容（语枢/兴趣/社交）"""
        culture_map = {
            "语枢启蒙": f"""# 语枢萌芽舱·{age}岁
汉字启蒙：象形字「山/水」与洛阳地理关联、节气古诗仿写（如《清明洛城行》）。
- **语言发展**：{self._get_language_development(age)}
- **文化关联**：
  - 「洛」字结构解析：三点水与河流
  - 古诗仿写：《咏牡丹》小短文
  - 方言学习：洛阳话日常用语""",
            "兴趣探索": f"""# 牡丹探索局·{age}岁
兴趣记录：牡丹写生作品、洛邑古城建筑模型搭建（融入「言启智云」科技元素）。
- **兴趣方向**：{self._get_interest_direction(age)}
- **文化实践**：
  - 牡丹绘画：水墨/水彩技法尝试
  - 古建筑模型：应天门/定鼎门结构研究
  - 科技融合：编程控制牡丹花灯""",
            "社交萌芽": f"""# 言启同行社·{age}岁
社交事件：班级「河洛文化小讲师」活动、与转学同学分享牡丹标本。
- **社交能力**：{self._get_social_skills(age)}
- **文化传播**：
  - 「洛阳三彩」主题分享会
  - 跨班级文化交流活动
  - 帮助新同学适应洛阳生活""",
            "国学浸润": f"""# 河洛传承阁·{age}岁
国学实践：端午洛绣香囊制作、中秋古法拜月仪式（附文化解读）。
- **传统节日**：{self._get_traditional_festival(age)}
- **礼仪学习**：
  - 拱手礼/作揖礼练习
  - 茶道基础：温杯/奉茶礼仪
  - 汉服穿戴：交领右衽的文化含义"""
        }
        return culture_map.get(layer, "# 成长记录待填充")

    def _get_7_12_content(self, layer, age):
        """7-12岁内容（学科/兴趣/社交）"""
        culture_map = {
            "学科启智": f"""# 智云学科舱·{age}岁
学科记录：数学「河图洛书」规律探索、语文「洛阳历史」作文集（如《我家的牡丹故事》）。
- **学科重点**：{self._get_subject_focus(age)}
- **文化融合**：
  - 数学：河图洛书中的数字规律
  - 语文：洛阳八大景游记写作
  - 科学：牡丹生长周期观察报告""",
            "兴趣深耕": f"""# 牡丹探索局·{age}岁
特长发展：牡丹国画考级记录、编程「智能牡丹识别」项目迭代。
- **特长发展**：{self._get_talent_development(age)}
- **项目实践**：
  - 国画：工笔牡丹技法进阶
  - 编程：基于图像识别的牡丹品种分类
  - 书法：颜真卿《多宝塔碑》临摹""",
            "社交成长": f"""# 言启同行社·{age}岁
社交事件：组织「河洛文化宣讲团」进社区、帮助同学适应洛阳新环境。
- **领导力培养**：{self._get_leadership_training(age)}
- **社会实践**：
  - 社区牡丹文化墙绘制
  - 「小小讲解员」在博物馆服务
  - 组织跨校文化交流活动""",
            "国学传承": f"""# 河洛传承阁·{age}岁
国学实践：汉服日礼仪展示、《论语》智慧在班级管理的应用（如「礼之用，和为贵」）。
- **经典研读**：{self._get_classics_study(age)}
- **实践应用**：
  - 《论语》每日一句践行记录
  - 传统射艺体验与礼仪学习
  - 洛阳方言保护志愿者活动""",
            "智能同行": f"""# 未来智枢台·{age}岁
AI应用：用「智能同行」工具分析学科薄弱点（关联洛阳中考数据）、编程作品《洛城交通模拟》。
- **科技应用**：{self._get_technology_application(age)}
- **创新项目**：
  - 智能助手：基于AI的洛阳文化问答机器人
  - 物联网：智能牡丹温室控制系统设计
  - 数据分析：洛阳旅游热点可视化"""
        }
        return culture_map.get(layer, "# 成长记录待填充")

    def _get_teen_content(self, layer, age):
        """13-18岁内容（生涯/社会/国学）"""
        culture_map = {
            "青春赋能": f"""# 未来智枢台·{age}岁
生涯探索：洛阳职业体验（如「牡丹园技术员」一日岗）、AI生涯测评（附河洛行业趋势）。
- **职业倾向**：{self._get_career_orientation(age)}
- **实践探索**：
  - 牡丹产业：种植/加工/营销全流程体验
  - 文化创意：洛阳元素文创产品设计
  - 科技企业：智能装备制造参观实习""",
            "学科冲刺": f"""# 智云学科舱·{age}岁
学科记录：历史「河洛文化」专题研究、物理「龙门石窟力学分析」实验报告。
- **中考/高考备战**：{self._get_exam_preparation(age)}
- **学术研究**：
  - 历史：隋唐洛阳城布局与现代城市规划
  - 物理：古建筑抗震结构原理研究
  - 生物：牡丹品种改良实验设计""",
            "生涯探索": f"""# 锚定启航港·{age}岁
生涯规划：「明珠使者」目标拆解（如科技竞赛备赛日志）、高校招生政策分析（关注河南院校）。
- **目标管理**：{self._get_goal_management(age)}
- **升学准备**：
  - 竞赛备战：信息学奥赛/科技创新大赛
  - 志愿填报：河南高校特色专业研究
  - 社会实践：「青年领袖」训练营""",
            "社会洞察": f"""# 言启同行社·{age}岁
社会实践：「牡丹文化推广」志愿活动、洛阳非遗调研（如唐三彩创新设计）。
- **社会参与**：{self._get_social_involvement(age)}
- **文化创新**：
  - 非遗保护：唐三彩制作技艺传承
  - 文化传播：洛阳文旅短视频创作
  - 公益行动：关爱洛阳留守老人志愿服务""",
            "河洛新青年": f"""# 河洛传承阁·{age}岁
文化输出：撰写《河洛文化青少年读本》章节、组织「智能+国学」校园论坛（如AI复原古洛阳）。
- **文化创作**：{self._get_cultural_creation(age)}
- **跨学科融合**：
  - 数字人文：3D建模复原洛阳古城
  - 智能国学：AI辅助《道德经》解读
  - 文化产业：牡丹主题文旅项目策划"""
        }
        return culture_map.get(layer, "# 成长记录待填充")

    def _get_adult_content(self, layer, age):
        """19-21岁内容（大学/职业/社会）"""
        culture_map = {
            "大学启航": f"""# 大学启航港·{age}岁
大学生活：专业学习、社团活动、社会实践（如「牡丹文化海外传播」项目）。
- **专业发展**：{self._get_university_development(age)}
- **校园生活**：
  - 学术研究：牡丹活性成分提取实验
  - 社团领导：汉服社/科技协会活动组织
  - 国际交流：洛阳文化海外宣讲""",
            "职业探索": f"""# 锚定启航港·{age}岁
职业准备：实习经历、职业技能培训（如「智能洛阳」智慧城市建设项目）。
- **职业规划**：{self._get_career_planning(age)}
- **实践积累**：
  - 企业实习：洛阳大数据产业基地实践
  - 技能认证：AI工程师/文化创意设计师
  - 创业尝试：牡丹主题文创产品线上销售""",
            "独立成长": f"""# 明珠共育廊·{age}岁
独立生活：理财规划、健康管理、社会关系建立（如「新洛阳人」社区服务）。
- **生活技能**：{self._get_life_skills(age)}
- **社会责任**：
  - 理财：个人收支管理与投资入门
  - 健康：运动习惯养成与膳食搭配
  - 社区：组织洛阳新移民文化适应工作坊""",
            "社会融入": f"""# 言启同行社·{age}岁
社会适应：职场人际关系、社会问题关注（如「洛阳老字号」品牌振兴调研）。
- **社会角色**：{self._get_social_role(age)}
- **文化担当**：
  - 职场：团队协作与项目管理经验
  - 调研：洛阳非遗传承现状与对策
  - 公益：发起「留住洛阳声音」方言保护计划""",
            "文化传承": f"""# 河洛传承阁·{age}岁
文化使命：作为「明珠使者」传承河洛文化（如策划「洛阳文化全球行」活动）。
- **文化使命**：{self._get_cultural_mission(age)}
- **创新实践**：
  - 国际传播：制作洛阳文化英文短视频
  - 科技融合：开发AR洛阳历史导览应用
  - 产业振兴：设计「牡丹+科技」跨界产品"""
        }
        return culture_map.get(layer, "# 成长记录待填充")

    # ===================== 角色任务内容 =====================
    def _get_role_task_content(self, role, task, age):
        """生成角色任务内容"""
        if role == "记录者":
            return f"""# {task}
## 记录者使命
记录沫语在{self.core_elements['age_stages'][age]}的关键成长瞬间，
以「{self.core_elements['人物']}」的视角，留存珍贵记忆。

## 本月重点
- 成长里程碑：{self._get_growth_milestone(age)}
- 文化印记：{self._get_cultural_imprint(age)}

## 记录指南
1. 每周记录2-3次关键事件
2. 附上照片/视频/语音等多媒体资料
3. 重点关注与河洛文化相关的体验
"""
        elif role == "守护者":
            return f"""# {task}
## 守护者使命
守护沫语在{self.core_elements['age_stages'][age]}的身心健康，
融合现代科技与河洛传统智慧，构建全方位保护体系。

## 本月重点
- 健康监测：{self._get_health_monitoring(age)}
- 安全保障：{self._get_safety_measures(age)}

## 执行指南
1. 每日记录健康数据（体温、睡眠等）
2. 每月更新安全知识学习内容
3. 每季度进行安全演练（如防火、防拐等）
"""
        elif role == "国学导师":
            return f"""# {task}
## 国学导师使命
引导沫语在{self.core_elements['age_stages'][age]}深入理解河洛文化精髓，
通过实践活动将传统文化智慧融入现代生活。

## 本月重点
- 经典研读：{self._get_classics_reading(age)}
- 实践活动：{self._get_practical_activity(age)}

## 教学指南
1. 每周1次经典讲解（如《论语》《道德经》）
2. 每月1次传统文化实践（如茶艺、书法）
3. 每季度组织文化考察（如龙门石窟、白马寺）
"""
        elif role == "智能助手":
            return f"""# {task}
## 智能助手使命
运用AI技术助力沫语在{self.core_elements['age_stages'][age]}的成长，
提供数据分析、智能推荐和决策支持，连接未来智慧。

## 本月重点
- 数据分析：{self._get_data_analysis(age)}
- 智能服务：{self._get_ai_services(age)}

## 功能说明
1. 成长数据分析：基于历史数据生成成长曲线
2. 智能推荐：根据兴趣偏好推荐学习资源
3. 决策支持：提供升学、职业选择等建议
"""
        return "# 任务内容待填充"

    # ===================== 辅助方法（文化细节） =====================
    def _get_monthly_focus(self, age, category):
        """获取每月发展重点（示例数据）"""
        focus_map = {
            "感知": ["视觉追踪训练", "听觉敏感度提升", "触觉分辨练习", "味觉探索"],
            "语言": ["单字模仿", "词语组合", "简单句子", "故事复述"],
            "社交": ["分享意识", "规则理解", "情绪表达", "冲突解决"]
        }
        return focus_map.get(category, ["发展重点待确定"])[age % len(focus_map.get(category, []))]

    def _get_solar_term_activity(self, age):
        """获取节气活动（示例数据）"""
        solar_terms = ["立春", "春分", "清明", "立夏", "夏至", "小暑", 
                      "立秋", "秋分", "寒露", "立冬", "冬至", "小寒"]
        activities = ["制作春牛图", "放飞河洛纸鸢", "洛浦踏青写生", 
                     "牡丹花期观测", "荷花手工制作", "防暑茶DIY", 
                     "秋收体验", "菊花品鉴会", "重阳登高", 
                     "冬储知识学习", "冬至饺子宴", "冰窗花创作"]
        index = (age * 3 + datetime.now().month) % len(solar_terms)
        return f"{solar_terms[index]}节气：{activities[index]}"

    def _get_vaccine_plan(self, age):
        """获取疫苗计划（示例数据）"""
        vaccines = {
            0: "乙肝疫苗第1针",
            1: "卡介苗",
            2: "脊灰疫苗第1针",
            3: "百白破疫苗第1针",
            4: "脊灰疫苗第2针",
            5: "百白破疫苗第2针",
            6: "乙肝疫苗第3针",
            12: "流脑疫苗第1针",
            18: "百白破疫苗第4针",
            24: "甲肝疫苗第1针"
        }
        return vaccines.get(age, "常规健康检查")

    def _get_growth_standard(self, age):
        """获取成长标准数据"""
        standards = {
            0: "出生体重: 2.5-4.0kg, 身长: 46-52cm",
            1: "体重: 7-11kg, 身长: 68-78cm", 
            2: "体重: 9-14kg, 身长: 78-90cm",
            3: "体重: 11-17kg, 身长: 85-102cm"
        }
        return standards.get(age, f"{age}岁标准体重身高待更新")
    
    def _get_seasonal_exploration(self, age):
        """获取季节探索活动"""
        activities = {
            0: "四季温感体验（空调房/室外温差）",
            1: "春花秋叶触摸体验", 
            2: "雪花雨滴观察记录",
            3: "四季服装搭配学习"
        }
        return activities.get(age, "季节探索活动规划中")
    
    def _get_language_development(self, age):
        """获取语言发展指标"""
        milestones = {
            4: "词汇量500-1000词，开始造句",
            5: "完整表达需求，理解简单故事",
            6: "流利对话，掌握基本汉字100字"
        }
        return milestones.get(age, "语言发展里程碑待记录")
    
    def _get_interest_direction(self, age):
        """获取兴趣发展方向"""
        interests = {
            4: "绘画涂鸦、积木搭建",
            5: "音乐律动、手工制作", 
            6: "科学实验、阅读故事",
            7: "体育运动、艺术创作"
        }
        return interests.get(age, "兴趣探索中")
    
    def _get_social_skills(self, age):
        """获取社交技能发展"""
        skills = {
            4: "学会分享，基本礼貌用语",
            5: "合作游戏，表达情感需求",
            6: "团队协作，解决简单冲突"
        }
        return skills.get(age, "社交技能发展中")
    
    def _get_traditional_festival(self, age):
        """获取传统节日活动"""
        festivals = {
            4: "春节贴窗花、端午包粽子体验",
            5: "中秋赏月、重阳敬老活动",
            6: "清明踏青、七夕手工体验"
        }
        return festivals.get(age, "传统节日活动规划中")
    
    def _get_subject_focus(self, age):
        """获取学科重点"""
        subjects = {
            7: "拼音识字、数字认知100以内",
            8: "基础运算、阅读理解提升",
            9: "乘法口诀、作文起步"
        }
        return subjects.get(age, "学科重点规划中")
    
    def _get_talent_development(self, age):
        """获取特长发展"""
        talents = {
            8: "绘画基础、音乐启蒙",
            9: "书法练习、体育特长选择",
            10: "编程思维、科学实验"
        }
        return talents.get(age, "特长发展探索中")
    
    def _get_leadership_training(self, age):
        """获取领导力培养"""
        leadership = {
            9: "班级小组长、值日班长体验",
            10: "组织班级活动、协调同学关系",
            11: "学生会干部、社团组织参与"
        }
        return leadership.get(age, "领导力培养规划中")
    
    def _get_classics_study(self, age):
        """获取国学经典学习"""
        classics = {
            7: "《弟子规》、《三字经》诵读",
            8: "《论语》节选、古诗词背诵",
            9: "《道德经》启蒙、传统礼仪学习"
        }
        return classics.get(age, "国学经典学习规划中")
    
    def _get_technology_application(self, age):
        """获取科技应用"""
        tech = {
            10: "编程基础、简单网页制作",
            11: "机器人编程、3D建模入门",
            12: "AI工具使用、数据分析基础"
        }
        return tech.get(age, "科技应用学习中")
    
    def _get_career_orientation(self, age):
        """获取职业导向"""
        career = {
            14: "职业兴趣测评、专业了解",
            15: "实习体验、行业认知",
            16: "大学专业选择、生涯规划"
        }
        return career.get(age, "职业导向探索中")
    
    def _get_exam_preparation(self, age):
        """获取考试准备"""
        exam = {
            14: "中考科目强化、答题技巧",
            16: "高考备战、学科竞赛",
            17: "志愿填报、面试准备"
        }
        return exam.get(age, "考试准备规划中")
    
    def _get_goal_management(self, age):
        """获取目标管理"""
        goals = {
            15: "短期目标设定、时间管理",
            16: "长期规划制定、执行监控",
            17: "目标调整、成果评估"
        }
        return goals.get(age, "目标管理学习中")
    
    def _get_social_involvement(self, age):
        """获取社会参与"""
        involvement = {
            16: "志愿服务、社区活动参与",
            17: "社会调研、公益项目组织",
            18: "社会实践、实习经历"
        }
        return involvement.get(age, "社会参与规划中")
    
    def _get_cultural_creation(self, age):
        """获取文化创作"""
        creation = {
            16: "文学创作、艺术作品",
            17: "文化研究、创意设计",
            18: "文化传播、跨界融合"
        }
        return creation.get(age, "文化创作探索中")
    
    def _get_university_development(self, age):
        """获取大学发展"""
        university = {
            19: "专业学习、社团参与",
            20: "学术研究、国际交流",
            21: "毕业设计、就业准备"
        }
        return university.get(age, "大学发展规划中")
    
    def _get_career_planning(self, age):
        """获取职业规划"""
        planning = {
            20: "职业技能培训、实习积累",
            21: "求职准备、职业发展路径"
        }
        return planning.get(age, "职业规划制定中")
    
    def _get_life_skills(self, age):
        """获取生活技能"""
        skills = {
            19: "独立生活、理财规划",
            20: "人际关系、健康管理",
            21: "社会适应、责任担当"
        }
        return skills.get(age, "生活技能培养中")
    
    def _get_social_role(self, age):
        """获取社会角色"""
        roles = {
            20: "职场新人、社区成员",
            21: "文化传承者、社会贡献者"
        }
        return roles.get(age, "社会角色定位中")
    
    def _get_cultural_mission(self, age):
        """获取文化使命"""
        mission = {
            19: "文化传承、创新发展",
            20: "文化传播、国际交流",
            21: "文化使者、未来领袖"
        }
        return mission.get(age, "文化使命承担中")
    
    def _get_growth_milestone(self, age):
        """获取成长里程碑"""
        milestones = [
            "第一次微笑", "第一次翻身", "第一次坐立", "第一次爬行",
            "第一次站立", "第一次走路", "第一次说话", "第一次认字"
        ]
        return milestones[age % len(milestones)]
    
    def _get_cultural_imprint(self, age):
        """获取文化印记"""
        imprints = [
            "洛阳方言初体验", "牡丹花香记忆", "河洛文化接触",
            "传统节日庆祝", "古城历史感受", "文化活动参与"
        ]
        return imprints[age % len(imprints)]
    
    def _get_health_monitoring(self, age):
        """获取健康监测"""
        monitoring = {
            0: "疫苗接种、生长发育监测",
            5: "视力听力检查、营养状况",
            12: "青春期发育、心理健康"
        }
        return monitoring.get(age, "常规健康检查")
    
    def _get_safety_measures(self, age):
        """获取安全措施"""
        safety = {
            2: "防跌倒、防误食、交通安全",
            6: "校园安全、网络安全教育",
            12: "自我保护、应急处理能力"
        }
        return safety.get(age, "安全教育进行中")
    
    def _get_classics_reading(self, age):
        """获取经典阅读"""
        reading = {
            6: "儿童古诗、成语故事",
            10: "四大名著节选、历史故事",
            15: "经典原文、哲学思辨"
        }
        return reading.get(age, "经典阅读规划中")
    
    def _get_practical_activity(self, age):
        """获取实践活动"""
        activities = {
            5: "传统手工、节日庆祝",
            10: "文化考察、社会实践",
            15: "志愿服务、文化传承"
        }
        return activities.get(age, "实践活动规划中")
    
    def _get_data_analysis(self, age):
        """获取数据分析"""
        analysis = {
            10: "学习成绩趋势、兴趣偏好分析",
            15: "能力发展曲线、生涯适配度",
            18: "综合素质评估、发展建议"
        }
        return analysis.get(age, "数据分析进行中")
    
    def _get_ai_services(self, age):
        """获取AI服务"""
        services = {
            8: "智能学习推荐、成长记录",
            12: "学科辅导、能力测评",
            16: "生涯规划、决策支持"
        }
        return services.get(age, "AI服务规划中")
    
    # ===================== 工具方法 =====================
    def _create_dir(self, path):
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"✅ 创建目录：{path}")

    def _write_file(self, file_path, content):
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 创建文件：{file_path}")

    def _create_core_info_file(self):
        """根目录写入文化基底与角色使命"""
        content = f"""# 沫语成长守护体系·核心档案
## 文化根基
{self.core_elements['文化基底']} · 融入「{','.join(self.core_elements['culture_symbols'])}」基因

## 守护使命
{self.core_elements['人物']} 以「记录者、守护者、国学导师、智能助手」四重角色， 
用智能工具留存成长轨迹，让河洛文化浸润时光，连接未来智慧。

## 核心原则
1. **年龄适配**：低龄聚焦「感知启蒙、亲子共育」，逐步引入学科、社交、生涯探索
2. **文化浸润**：所有文件夹与记录统一使用「4-5字文化词」（如「语枢启蒙舱」）
3. **智能融合**：AI辅助成长分析，传统文化与现代科技平衡发展
4. **全维度记录**：涵盖健康、学业、兴趣、社交、文化传承五大成长维度

## 体系结构沫语成长守护体系
├── 0岁_启元初绽
│   ├── 感知启蒙舱
│   ├── 亲子共育录
│   ├── 记录者日志
│   └── 守护者日志
├── 1岁_萌智初醒
│   ├── 感知启蒙舱
│   ├── 亲子共育录
│   └── ...
└── 体系总览.md"""
        self._write_file(os.path.join(self.root_dir, "体系总览.md"), content)

    def _get_annual_summary(self, age):
        """年度总结（带文化寄语）"""
        culture_gift = {
            0: "启元初绽：洛阳牡丹待放，你是最珍贵的花苞",
            1: "萌智初醒：洛河春水潺潺，唤醒探索的眼睛",
            3: "探趣洛城：牡丹花蕊初展，小脚丫丈量千年帝都",
            6: "入学明礼：龙门石窟的智慧，陪你开启求知路",
            12: "初中文枢：智云托举梦想，语枢连接未来",
            18: "成人礼赞：牡丹国色绽放，你是河洛新青年",
            21: "毕业启程：明珠闪耀四海，传承河洛文明"
        }
        return f"""# {self.core_elements['age_stages'][age]} 年度总结
## 文化寄语
{culture_gift.get(age, f"{self.core_elements['age_stages'][age]}：成长如洛城四季，各有美好")}

## 核心成长轨迹
（此处可接入AI分析：健康曲线、兴趣趋势、学科发展等）

## 年度大事记
1. 
2. 
3. 

## 文化成就
- 
- 
- 

## 未来展望
{self._get_future_outlook(age)}
"""

    def _get_future_outlook(self, age):
        """生成未来展望（示例数据）"""
        if age < 6:
            return "期待你在新的一年里，继续用好奇的眼睛探索河洛大地，在传统文化的滋养中茁壮成长。"
        elif age < 12:
            return "希望你能在学科学习与兴趣发展中找到平衡，将河洛文化的智慧融入日常，成为智慧少年。"
        elif age < 18:
            return "愿你明确志向，为梦想全力以赴，在冲刺征途上绽放牡丹般的光彩，传承河洛文明。"
        else:
            return "期待你以河洛文化为根基，勇敢走向世界，用所学知识回馈社会，成为新时代的文化使者。"

# ===================== 执行生成 =====================
if __name__ == "__main__":
    system = MuyuGrowthSystem()
    system.generate_growth_tree()