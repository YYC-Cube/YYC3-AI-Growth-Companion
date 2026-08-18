"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { characterManager, type CharacterConfig, type Child } from "@/lib/character-manager"

interface RoleInfoManagerProps {
  child?: Child | null
  onSave?: (updatedChild: Child) => void
  onCancel?: () => void
}

export default function RoleInfoManager({ child, onSave }: RoleInfoManagerProps) {
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Child>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (child) {
      setCharacter(characterManager.getCharacterForUser(child))
      setFormData({
        id: child.id,
        name: child.name || "",
        gender: child.gender || "female",
        birthday: child.birthday
      })
    } else {
      const defaultCharacter = characterManager.getCharacterByGender("female")
      setCharacter(defaultCharacter)
      setFormData({
        gender: "female"
      })
    }
  }, [child])

  // 验证表单数据
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = "姓名不能为空"
    } else if (formData.name.length > 10) {
      errors.name = "姓名不能超过10个字符"
    }

    if (!formData.gender || !["male", "female"].includes(formData.gender as string)) {
      errors.gender = "请选择有效的性别"
    }

    if (!formData.birthday) {
      errors.birthday = "请选择生日"
    } else {
      const birthday = new Date(formData.birthday)
      const today = new Date()
      if (birthday > today) {
        errors.birthday = "生日不能是未来日期"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const updatedChild: Child = {
      id: formData.id || `child_${Date.now()}`,
      name: formData.name?.trim() || "",
      gender: formData.gender as "male" | "female",
      birthday: formData.birthday,
      avatarUrl: formData.avatarUrl,
      preferences: formData.preferences
    }

    if (onSave) {
      onSave(updatedChild)
    }
    setIsEditing(false)
  }

  // 处理性别切换
  const handleGenderChange = (gender: "male" | "female") => {
    setFormData({ ...formData, gender })
    const newCharacter = characterManager.getCharacterByGender(gender)
    
    // 如果有姓名，更新角色姓名
    if (formData.name) {
      newCharacter.name = formData.name
    }
    
    // 如果有生日，更新角色信息
    if (formData.birthday) {
      const age = characterManager["calculateAge"](formData.birthday)
      const zodiac = characterManager["calculateZodiac"](formData.birthday)
      const lunarBirthday = characterManager["convertToLunar"](formData.birthday)
      
      newCharacter.age = age
      newCharacter.birthday = {
        lunar: lunarBirthday,
        solar: formData.birthday.toISOString().split('T')[0]
      }
      newCharacter.zodiac = zodiac
    }
    
    setCharacter(newCharacter)
  }

  // 处理生日变更
  const handleBirthdayChange = (birthday: Date) => {
    setFormData({ ...formData, birthday })
    
    if (character) {
      const age = characterManager["calculateAge"](birthday)
      const zodiac = characterManager["calculateZodiac"](birthday)
      const lunarBirthday = characterManager["convertToLunar"](birthday)
      
      const updatedCharacter = {
        ...character,
        age: age,
        birthday: {
          lunar: lunarBirthday,
          solar: birthday.toISOString().split('T')[0]
        },
        zodiac: zodiac
      }
      
      setCharacter(updatedCharacter)
    }
  }

  // 格式化日期显示
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (!character) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">角色信息管理</h2>
        <p className="text-slate-600">管理和确保角色信息的准确性</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 角色预览 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">角色预览</h3>
            
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg mb-4">
                <img
                  src={characterManager.getCharacterImagePath(character, "happy")}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h4 className="text-xl font-bold text-slate-800">{character.name}</h4>
              <p className="text-slate-600">{character.gender === "male" ? "男孩" : "女孩"}</p>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">年龄：</span>
                  <span className="font-medium">{character.age}岁</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">生日：</span>
                  <span className="font-medium">{character.birthday.solar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">农历：</span>
                  <span className="font-medium">{character.birthday.lunar}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">星座：</span>
                  <span className="font-medium">{character.zodiac}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 角色主题预览 */}
          <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">主题预览</h3>
            <div className="grid grid-cols-3 gap-2">
              {character.themes.map((theme) => (
                <div
                  key={theme.id}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    const updatedCharacter = {
                      ...character,
                      defaultImage: theme.imagePath
                    }
                    setCharacter(updatedCharacter)
                  }}
                >
                  <div
                    className="w-full h-16 rounded-lg flex items-center justify-center text-white font-medium text-xs"
                    style={{
                      background: theme.gradient
                    }}
                  >
                    {theme.displayName}
                  </div>
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-white transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 信息编辑 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">基本信息</h3>
            
            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                  <p className="text-slate-900">{formData.name || "未设置"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">性别</label>
                  <p className="text-slate-900">{formData.gender === "male" ? "男孩" : "女孩"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">生日</label>
                  <p className="text-slate-900">
                    {formData.birthday ? formatDate(formData.birthday) : "未设置"}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  编辑信息
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.name ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="请输入姓名"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">性别</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={() => handleGenderChange("male")}
                        className="mr-2"
                      />
                      男孩
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={() => handleGenderChange("female")}
                        className="mr-2"
                      />
                      女孩
                    </label>
                  </div>
                  {validationErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">生日</label>
                  <input
                    type="date"
                    value={formData.birthday ? formData.birthday.toISOString().split('T')[0] : ""}
                    onChange={(e) => handleBirthdayChange(new Date(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.birthday ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {validationErrors.birthday && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.birthday}</p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setValidationErrors({})
                    }}
                    className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 角色表情预览 */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">表情预览</h3>
            <div className="grid grid-cols-3 gap-2">
              {character.expressions.map((expression) => (
                <div
                  key={expression.id}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    const updatedCharacter = {
                      ...character,
                      defaultImage: expression.imagePath
                    }
                    setCharacter(updatedCharacter)
                  }}
                >
                  <div className="w-full h-16 bg-white rounded-lg overflow-hidden">
                    <img
                      src={expression.imagePath}
                      alt={expression.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-center mt-1 text-slate-600">{expression.displayName}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}