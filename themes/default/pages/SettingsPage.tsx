import React, { useState } from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Button } from '../foundation/Button';
import { Card } from '../foundation/Card';
import { AvatarCustomizer } from '../business/AvatarCustomizer';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { UserInformation } from '../../../services/userProfile/userInformationManager';
import { GlobalAvatar } from '../../../services/avatar/avatarSystem';
import { characterManager } from '../../../services/character';

export interface SettingsPageProps {
  userId: string;
  onNavigate?: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userId, onNavigate }) => {
  const { userInfo, loading, updatePreferences, updateAvatar } = useUserProfile(userId);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  
  // 获取当前角色配置
  const currentCharacter = characterManager.getCurrentCharacter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">加载设置中...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <p className="text-gray-600">无法加载用户信息</p>
      </div>
    );
  }

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    try {
      await updatePreferences({ theme });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleFontSizeChange = async (fontSize: 'small' | 'medium' | 'large') => {
    try {
      await updatePreferences({ fontSize });
    } catch (error) {
      console.error('Failed to update font size:', error);
    }
  };

  const handleVoiceToggle = async () => {
    try {
      await updatePreferences({ voiceEnabled: !userInfo.preferences.voiceEnabled });
    } catch (error) {
      console.error('Failed to toggle voice:', error);
    }
  };

  const handleAvatarSave = async (avatar: GlobalAvatar) => {
    try {
      await updateAvatar(avatar);
      setShowAvatarCustomizer(false);
    } catch (error) {
      console.error('Failed to save avatar:', error);
    }
  };

  if (showAvatarCustomizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <AvatarCustomizer
            userId={userId}
            currentAvatar={userInfo.globalAvatar}
            onSave={handleAvatarSave}
            onCancel={() => setShowAvatarCustomizer(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* 导航栏 */}
      <PageNavigation title="设置与管理" icon="⚙️" />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 用户信息卡片 */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-3xl">{currentCharacter?.gender === 'male' ? '👦' : '👧'}</span>
                </div>
                <div>
                  <h2 className="text-white mb-1">{userInfo.basicInfo.name || '未登录'}</h2>
                  <p className="text-white/80 text-sm">点击登录来查看详细信息</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
              >
                登录/注册
              </Button>
            </div>
          </div>
        </div>

        {/* 账户与安全 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-600">👤</span>
            <h3 className="text-gray-900">账户与安全</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* 修改资料/昵称 */}
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">✏️</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">修改资料/昵称</p>
                  <p className="text-gray-500 text-sm">请先登录</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            {/* 家长锁模式 */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">🔒</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">家长锁模式</p>
                  <p className="text-gray-500 text-sm">用于家长解锁或定时解锁</p>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                查看
              </button>
            </div>
          </div>
        </div>

        {/* 学习偏好 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-600">📚</span>
            <h3 className="text-gray-900">学习偏好</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* 护眼模式 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">👁️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">护眼模式</p>
                  <p className="text-gray-500 text-sm">开启后背景将变暗为墨绿色</p>
                </div>
              </div>
              <button
                onClick={() => handleThemeChange(userInfo.preferences.theme === 'dark' ? 'light' : 'dark')}
                className={`w-14 h-8 rounded-full transition-colors ${
                  userInfo.preferences.theme === 'dark'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                    userInfo.preferences.theme === 'dark'
                      ? 'translate-x-7'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 学习进度提醒 */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600">🔔</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">学习进度提醒</p>
                  <p className="text-gray-500 text-sm">每天发送一次进度提醒</p>
                </div>
              </div>
              <button
                className="w-14 h-8 rounded-full bg-gray-300 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* 家长与帮助 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-600">🎯</span>
            <h3 className="text-gray-900">家长与帮助</h3>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {/* 常见问题 */}
              <button className="p-6 hover:bg-gray-50 transition-colors text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="font-medium text-gray-900">常见问题 (FAQ)</p>
              </button>

              {/* 联系我们 */}
              <button className="p-6 hover:bg-gray-50 transition-colors text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📞</span>
                </div>
                <p className="font-medium text-gray-900">联系我们</p>
              </button>
            </div>
            
            {/* 获取账号 */}
            <button className="w-full p-6 border-t border-gray-100 hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="font-medium text-blue-600">获取账号</p>
              </div>
            </button>
          </div>
        </div>

        {/* 高级设置 - 可折叠 */}
        <details className="mb-6">
          <summary className="cursor-pointer bg-white rounded-2xl shadow-md p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">🔧</span>
              <h3 className="text-gray-900">高级设置</h3>
            </div>
            <span className="text-gray-400">▼</span>
          </summary>
          
          <div className="mt-4 space-y-4">
            {/* 字体大小 */}
            <Card>
              <h4 className="mb-4 flex items-center gap-2">
                <span>🔤</span>
                <span>字体大小</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      userInfo.preferences.fontSize === size
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`font-medium ${
                      size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''
                    }`}>
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* 语音设置 */}
            <Card>
              <h4 className="mb-4 flex items-center gap-2">
                <span>🎤</span>
                <span>语音设置</span>
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">启用语音交互</p>
                  <p className="text-gray-600 text-sm">允许使用语音与AI助手对话</p>
                </div>
                <button
                  onClick={handleVoiceToggle}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    userInfo.preferences.voiceEnabled
                      ? 'bg-purple-500'
                      : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                      userInfo.preferences.voiceEnabled
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* 语言设置 */}
            <Card>
              <h4 className="mb-4 flex items-center gap-2">
                <span>🌐</span>
                <span>语言设置</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {(['zh-CN', 'en-US'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => updatePreferences({ language: lang })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      userInfo.preferences.language === lang
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">
                      {lang === 'zh-CN' ? '简体中文' : 'English'}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* 系统管理 */}
            <Card>
                <h4 className="mb-4 flex items-center gap-2">
                    <span>🛠️</span>
                    <span>系统管理</span>
                </h4>
                <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={() => onNavigate?.('character_system')}
                >
                    <span>角色信息管理</span>
                    <span>→</span>
                </Button>
            </Card>
          </div>
        </details>
      </div>
    </div>
  );
};