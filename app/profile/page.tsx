"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import PageHeader from "@/components/headers/PageHeader"
import UserCenter from "@/components/auth/UserCenter"
import { useAuth } from "@/hooks/useAuth"
import { useChildrenMock } from "@/hooks/useChildren-mock"
import { characterManager } from "@/lib/character-manager"
import { 
  GlobalSettingsItem, 
  GlobalSettingsSection,
  GlobalFunctionButton,
} from "@/lib/ui/global-ui-components"
import type { UserProfile } from "@/types"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({})
  const [userProfile, setUserProfile] = useState<UserProfile>({
    bio: "",
    interests: [],
    ageGroup: {
      id: "",
      name: "",
      minAge: 0,
      maxAge: 0,
      description: "",
      characteristics: [],
      recommendations: []
    },
    grade: "",
    school: "",
    birthday: {
      lunar: "",
      solar: ""
    },
    zodiac: ""
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { currentChild } = useChildrenMock()

  // 获取角色信息
  const character = currentChild ? characterManager.getCharacterForUser(currentChild) : null

  // 加载用户档案数据
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        const userId = user?.id || "user-001" // 默认使用模拟用户ID
        
        const response = await fetch(`/api/user-profile?userId=${userId}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            setUserProfile(data.data)
          } else {
            // 如果没有找到档案，使用默认值
            const defaultProfile: UserProfile = {
              bio: "我是一个热爱学习的小朋友，喜欢探索新知识和结交新朋友。",
              interests: ["阅读", "绘画", "音乐", "科学实验"],
              ageGroup: {
                id: "elementary",
                name: "小学阶段",
                minAge: 6,
                maxAge: 12,
                description: "小学阶段儿童",
                characteristics: ["好奇心强", "学习能力强", "社交能力发展"],
                recommendations: ["培养学习习惯", "发展兴趣爱好", "社交技能训练"]
              },
              grade: "三年级",
              school: "阳光小学",
              birthday: character ? {
                lunar: character.birthday.lunar,
                solar: character.birthday.solar
              } : {
                lunar: "正月十五",
                solar: "2020-02-08"
              },
              zodiac: character ? character.zodiac : "♒ 水瓶座"
            }
            setUserProfile(defaultProfile)
          }
        } else {
          throw new Error("Failed to load user profile")
        }
      } catch (error) {
        console.error("加载用户档案失败:", error)
        // 使用默认值
        const defaultProfile: UserProfile = {
          bio: "我是一个热爱学习的小朋友，喜欢探索新知识和结交新朋友。",
          interests: ["阅读", "绘画", "音乐", "科学实验"],
          ageGroup: {
            id: "elementary",
            name: "小学阶段",
            minAge: 6,
            maxAge: 12,
            description: "小学阶段儿童",
            characteristics: ["好奇心强", "学习能力强", "社交能力发展"],
            recommendations: ["培养学习习惯", "发展兴趣爱好", "社交技能训练"]
          },
          grade: "三年级",
          school: "阳光小学",
          birthday: character ? {
            lunar: character.birthday.lunar,
            solar: character.birthday.solar
          } : {
            lunar: "正月十五",
            solar: "2020-02-08"
          },
          zodiac: character ? character.zodiac : "♒ 水瓶座"
        }
        setUserProfile(defaultProfile)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user, character])

  // 处理编辑按钮点击
  const handleEditProfile = () => {
    setIsEditing(true)
    setProfileForm(userProfile)
  }

  // 处理保存按钮点击
  const handleSaveProfile = async () => {
    try {
      // 获取当前用户ID
      const userId = user?.id || "user-001" // 默认使用模拟用户ID
      
      // 首先尝试获取现有档案
      const getResponse = await fetch(`/api/user-profile?userId=${userId}`)
      let existingProfile = null
      
      if (getResponse.ok) {
        const getData = await getResponse.json()
        existingProfile = getData.data
      }
      
      // 准备要保存的数据
      const profileData = {
        ...userProfile,
        ...profileForm,
        user_id: userId
      }
      
      let saveResponse
      if (existingProfile) {
        // 更新现有档案
        saveResponse = await fetch("/api/user-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: existingProfile.id,
            ...profileData
          }),
        })
      } else {
        // 创建新档案
        saveResponse = await fetch("/api/user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        })
      }
      
      if (saveResponse.ok) {
        const result = await saveResponse.json()
        console.log("档案保存成功:", result.data)
        // 更新本地状态
        setUserProfile(result.data)
        setIsEditing(false)
        setProfileForm({})
        
        // 显示成功提示
        alert("档案保存成功！")
      } else {
        throw new Error("保存失败")
      }
    } catch (error) {
      console.error("保存档案信息失败:", error)
      alert("保存失败，请重试")
    }
  }

  // 处理取消按钮点击
  const handleCancelEdit = () => {
    setIsEditing(false)
    setProfileForm({})
  }

  // 处理表单字段变化
  const handleFormChange = (field: string, value: any) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-sky-100">
      <PageHeader icon="ri-user-fill" title="个人档案" />

      <main className="flex-1 overflow-y-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">加载中...</p>
            </div>
          </div>
        ) : (
          <section className="max-w-5xl mx-auto w-full px-8 pb-28 pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 用户基本信息卡片 */}
          <section className="col-span-1 md:col-span-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 shadow-soft text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {character ? (
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={characterManager.getCharacterImagePath(character, 'happy')} 
                        alt={currentChild?.name || "角色"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                      {user ? `${user.firstName || ""}${user.lastName || ""}`.charAt(0) || user.email?.charAt(0) || "U" : "?"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">{currentChild?.name || (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email?.split("@")[0] : "未登录")}</h3>
                    <p className="text-white/80">{currentChild?.nickname || "小朋友"}</p>
                  </div>
                </div>
                <UserCenter />
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{userProfile.grade || "未知"}</p>
                  <p className="text-white/70 text-xs">年级</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{userProfile.school || "未知"}</p>
                  <p className="text-white/70 text-xs">学校</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{userProfile.zodiac || "未知"}</p>
                  <p className="text-white/70 text-xs">星座</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{userProfile.interests.length}</p>
                  <p className="text-white/70 text-xs">兴趣爱好</p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* 基本档案信息 */}
          <GlobalSettingsSection 
            title="基本档案" 
            icon="ri-user-fill" 
            iconColor="text-blue-500"
          >
            <GlobalSettingsItem
              icon="ri-calendar-fill"
              iconColor="text-blue-400"
              title="阳历生日"
              subtitle={isEditing ? (
                <input
                  type="date"
                  value={profileForm.birthday?.solar || userProfile.birthday?.solar || ""}
                  onChange={(e) => handleFormChange("birthday", {
                    ...profileForm.birthday,
                    solar: e.target.value
                  })}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-gray-800"
                />
              ) : (
                userProfile.birthday?.solar || "未设置"
              )}
            />
            <GlobalSettingsItem
              icon="ri-moon-fill"
              iconColor="text-purple-400"
              title="农历生日"
              subtitle={isEditing ? (
                <input
                  type="text"
                  value={profileForm.birthday?.lunar || userProfile.birthday?.lunar || ""}
                  onChange={(e) => handleFormChange("birthday", {
                    ...profileForm.birthday,
                    lunar: e.target.value
                  })}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-gray-800"
                />
              ) : (
                userProfile.birthday?.lunar || "未设置"
              )}
            />
            <GlobalSettingsItem
              icon="ri-star-fill"
              iconColor="text-yellow-400"
              title="星座"
              subtitle={isEditing ? (
                <input
                  type="text"
                  value={profileForm.zodiac || userProfile.zodiac || ""}
                  onChange={(e) => handleFormChange("zodiac", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-gray-800"
                />
              ) : (
                userProfile.zodiac || "未设置"
              )}
            />
          </GlobalSettingsSection>

          {/* 学校信息 */}
          <GlobalSettingsSection 
            title="学校信息" 
            icon="ri-school-fill" 
            iconColor="text-green-500"
          >
            <GlobalSettingsItem
              icon="ri-book-2-fill"
              iconColor="text-green-400"
              title="年级"
              subtitle={isEditing ? (
                <select
                  value={profileForm.grade || userProfile.grade || ""}
                  onChange={(e) => handleFormChange("grade", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-gray-800"
                >
                  <option value="">请选择年级</option>
                  <option value="幼儿园">幼儿园</option>
                  <option value="一年级">一年级</option>
                  <option value="二年级">二年级</option>
                  <option value="三年级">三年级</option>
                  <option value="四年级">四年级</option>
                  <option value="五年级">五年级</option>
                  <option value="六年级">六年级</option>
                </select>
              ) : (
                userProfile.grade || "未设置"
              )}
            />
            <GlobalSettingsItem
              icon="ri-building-fill"
              iconColor="text-blue-400"
              title="学校"
              subtitle={isEditing ? (
                <input
                  type="text"
                  value={profileForm.school || userProfile.school || ""}
                  onChange={(e) => handleFormChange("school", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-gray-800"
                />
              ) : (
                userProfile.school || "未设置"
              )}
            />
          </GlobalSettingsSection>

          {/* 个人介绍 */}
          <GlobalSettingsSection 
            title="个人介绍" 
            icon="ri-quill-pen-fill" 
            iconColor="text-purple-500"
          >
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              {isEditing ? (
                <textarea
                  value={profileForm.bio || userProfile.bio || ""}
                  onChange={(e) => handleFormChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 resize-none"
                  placeholder="介绍一下自己吧..."
                />
              ) : (
                <p className="text-gray-700">{userProfile.bio || "这个人很懒，还没有写介绍~"}</p>
              )}
            </div>
          </GlobalSettingsSection>

          {/* 兴趣爱好 */}
          <GlobalSettingsSection 
            title="兴趣爱好" 
            icon="ri-heart-fill" 
            iconColor="text-red-500"
          >
            <div className="flex flex-wrap gap-2">
              {(isEditing ? profileForm.interests : userProfile.interests)?.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              )) || (
                <p className="text-gray-500 text-sm">还没有设置兴趣爱好</p>
              )}
            </div>
          </GlobalSettingsSection>

          {/* 操作按钮 */}
          <section className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-6">
            {isEditing ? (
              <>
                <GlobalFunctionButton
                  variant="outline"
                  size="lg"
                  enabled={true}
                  onClick={handleCancelEdit}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  取消
                </GlobalFunctionButton>
                <GlobalFunctionButton
                  variant="default"
                  size="lg"
                  enabled={true}
                  onClick={handleSaveProfile}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  保存
                </GlobalFunctionButton>
              </>
            ) : (
              <GlobalFunctionButton
                variant="default"
                size="lg"
                enabled={true}
                onClick={handleEditProfile}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <i className="ri-edit-line mr-2" />
                编辑档案
              </GlobalFunctionButton>
            )}
          </section>
        </section>
        )}
      </main>

      <Navigation />
    </div>
  )
}