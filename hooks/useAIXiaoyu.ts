/**
 * @fileoverview YYC³ AI小语智能成长守护系统 - AI交互钩子
 * @description 提供AI角色交互、消息发送、语音交互等核心AI功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { getVoiceSystem } from '@/lib/voice/voice-system';
import {
  type AIRole,
  COMPLETE_AI_ROLES,
  selectOptimalRole,
  analyzeUserEmotion,
  generatePersonalizedResponse,
} from '@/lib/ai_roles_complete';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiRole?: AIRole;
  emotion?: string;
  modules?: string[];
  coordinatedRoles?: string[];
}

export interface AIState {
  isListening: boolean;
  isProcessing: boolean;
  isWakeWordActive: boolean;
  currentRole: AIRole;
  emotion: {
    type: string;
    confidence: number;
  } | null;
}

export function useAIXiaoyu() {
  const [state, setState] = useState<AIState>({
    isListening: false,
    isProcessing: false,
    isWakeWordActive: false,
    currentRole: 'advisor',
    emotion: null,
  });
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [voiceSystem, setVoiceSystem] = useState<ReturnType<
    typeof getVoiceSystem
  > | null>(null);

  // 初始化语音系统
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const system = getVoiceSystem();
      setVoiceSystem(system);
    }
  }, []);

  // 开始语音识别
  const startListening = useCallback(() => {
    if (!voiceSystem) return;

    setState(prev => ({ ...prev, isListening: true }));

    voiceSystem.startListening(
      result => {
        if (result.isFinal) {
          setState(prev => ({ ...prev, isListening: false }));
          sendMessage(result.transcript, state.currentRole);
        }
      },
      error => {
        console.error('[v0] 语音识别错误:', error);
        setState(prev => ({ ...prev, isListening: false }));
      }
    );
  }, [voiceSystem, state.currentRole]);

  // 停止语音识别
  const stopListening = useCallback(() => {
    if (voiceSystem) {
      voiceSystem.stopListening();
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, [voiceSystem]);

  // 启动语音唤醒监听
  const startWakeWordListening = useCallback(
    (onWake: () => void) => {
      if (!voiceSystem) return;

      setState(prev => ({ ...prev, isWakeWordActive: true }));

      voiceSystem.startWakeWordListening(() => {
        onWake();
        // 唤醒后自动开始录音
        setTimeout(() => {
          startListening();
        }, 500);
      });
    },
    [voiceSystem, startListening]
  );

  // 停止语音唤醒监听
  const stopWakeWordListening = useCallback(() => {
    if (voiceSystem) {
      voiceSystem.stopWakeWordListening();
    }
    setState(prev => ({ ...prev, isWakeWordActive: false }));
  }, [voiceSystem]);

  // 切换当前角色
  const setCurrentRole = useCallback((role: AIRole) => {
    setState(prev => ({ ...prev, currentRole: role }));
  }, []);

  // 切换角色的别名方法，兼容EnhancedAIWidget使用
  const switchRole = useCallback(
    (role: string | AIRole) => {
      setCurrentRole(role as AIRole);
    },
    [setCurrentRole]
  );

  // 添加消息方法
  const addMessage = useCallback((message: Omit<AIMessage, 'timestamp'>) => {
    setMessages(prev => [
      ...prev,
      {
        ...message,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // 发送消息
  const sendMessage = useCallback(
    async (content: string, role?: AIRole) => {
      // 使用增强的智能角色选择系统
      const emotionAnalysis = analyzeUserEmotion(content);
      const optimalRole = role || selectOptimalRole(content, undefined, undefined, emotionAnalysis).role;

      // 如果智能选择了不同的角色，更新当前角色
      if (optimalRole !== state.currentRole && !role) {
        setState(prev => ({ ...prev, currentRole: optimalRole }));
      }

      const userMessage: AIMessage = {
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setState(prev => ({ ...prev, isProcessing: true }));

      try {
        // 生成个性化回应
        const personalizedResponse = generatePersonalizedResponse(
          content,
          optimalRole,
          emotionAnalysis
        );

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            role: optimalRole,
            systemPrompt: COMPLETE_AI_ROLES[optimalRole]?.systemPrompt,
            personality: COMPLETE_AI_ROLES[optimalRole]?.personality,
            emotionAnalysis,
            personalizedResponse,
            history: messages.slice(-6),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = '';

        if (reader) {
          // 创建助手消息占位符
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: '',
              timestamp: new Date(),
              aiRole: optimalRole,
            },
          ]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    accumulatedResponse += parsed.content;
                    // 实时更新消息内容
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastIndex = newMessages.length - 1;
                      if (newMessages[lastIndex]?.role === 'assistant') {
                        newMessages[lastIndex] = {
                          ...newMessages[lastIndex],
                          content: accumulatedResponse,
                        };
                      }
                      return newMessages;
                    });
                  }
                } catch (e) {
                  // 忽略解析错误
                }
              }
            }
          }

          // 分析响应情感
          if (voiceSystem && accumulatedResponse) {
            const emotionData =
              voiceSystem.detectTextEmotion(accumulatedResponse);
            setState(prev => ({ ...prev, emotion: emotionData }));
          }
        }
      } catch (error) {
        console.error('[v0] AI响应错误:', error);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '抱歉，我遇到了一些问题。请稍后再试。',
            timestamp: new Date(),
            aiRole: optimalRole,
          },
        ]);
      } finally {
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    },
    [messages, voiceSystem, state.currentRole]
  );

  // 语音播报文本（恢复自 yyc3-xy-022 在途工作：角色化语音风格映射）
  const speakText = useCallback(
    async (text: string, useRoleVoice = true) => {
      if (!voiceSystem) return;

      try {
        if (useRoleVoice && state.currentRole) {
          const roleStyleMap: Record<
            string,
            'cheerful' | 'calm' | 'gentle' | 'professional' | 'warm'
          > = {
            advisor: 'professional',
            companion: 'warm',
            teacher: 'gentle',
            coach: 'cheerful',
            friend: 'warm',
          };
          const style = roleStyleMap[state.currentRole] || 'calm';
          await voiceSystem.speakWithRole(text, style);
        } else {
          await voiceSystem.speak(text);
        }
      } catch (error) {
        console.error('[useAIXiaoyu] 语音播报错误:', error);
      }
    },
    [voiceSystem, state.currentRole]
  );

  // 停止语音播报（恢复自 yyc3-xy-022 在途工作）
  const stopSpeaking = useCallback(() => {
    if (voiceSystem) {
      voiceSystem.stopSpeaking();
    }
  }, [voiceSystem]);

  // 清空对话历史
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    // 状态
    isListening: state.isListening,
    isProcessing: state.isProcessing,
    isWakeWordActive: state.isWakeWordActive,
    currentRole: state.currentRole,
    emotion: state.emotion,
    messages,

    // 方法
    startListening,
    stopListening,
    startWakeWordListening,
    stopWakeWordListening,
    setCurrentRole,
    switchRole,
    sendMessage,
    addMessage,
    speakText,
    stopSpeaking,
    clearMessages,
  };
}
