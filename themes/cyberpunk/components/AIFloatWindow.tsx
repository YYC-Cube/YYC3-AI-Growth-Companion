import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mic, Sparkles, Zap } from 'lucide-react';
import aiFloatButtonImage from 'figma:asset/eefcde44abc5ffeeafd4c29bd11a37e6bb443de7.png';
import xiaoyuAvatarImage from 'figma:asset/756dfe314fb38126716f95a510053d8b3706a450.png';
import { useTheme } from '../../contexts/ThemeContext';

export interface AIFloatWindowProps {
  initialPosition?: { x: number; y: number };
  size?: { width: number; height: number };
  theme?: 'light' | 'dark';
  onInteraction?: (type: string, data?: Record<string, unknown>) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const springConfig = { type: 'spring' as const, stiffness: 400, damping: 28 };

export const AIFloatWindow: React.FC<AIFloatWindowProps> = ({
  onInteraction,
  className = '',
}) => {
  const { isCyberpunk } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: isCyberpunk
        ? '系统在线。我是小语AI，你的赛博伙伴 ⚡ 有什么指令？'
        : '你好！我是小语，你的AI成长伙伴 🌿 有什么我可以帮你的吗？',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (input: string): string => {
    if (input.includes('洛阳') || input.includes('文化')) {
      return isCyberpunk
        ? '数据库检索完毕：洛阳 — 十三朝古都 ⚡ 龙门石窟、白马寺、牡丹花会，选择你的探索目标。'
        : '洛阳是十三朝古都，有着非常丰富的历史文化！🏛️ 你想了解龙门石窟、白马寺，还是牡丹花会呢？';
    }
    if (input.includes('学习') || input.includes('作业')) {
      return isCyberpunk
        ? '学习模块加载中... 📡 任务列表已同步。先启动语文还是数学模块？'
        : '学习是一件快乐的事！📚 我们一步一步来，先从今天的任务开始吧。你想先复习语文还是数学呢？';
    }
    if (input.includes('你好') || input.includes('嗨')) {
      return isCyberpunk
        ? '信号接收 ⚡ 系统状态正常。准备好探索了吗？'
        : '你好呀！🌱 今天过得怎么样？有什么想和小语聊聊的吗？';
    }
    return isCyberpunk
      ? `指令已接收："${input}" ⚡ 正在处理数据，准备执行...`
      : `我听到你说的了！"${input}" 这是个很好的想法 🌿 我们可以一起探索更多哦～`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsThinking(true);
    onInteraction?.('send-message', { content: inputText });

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputText),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    onInteraction?.('voice-click', { listening: !isListening });
    if (!isListening) {
      setTimeout(() => {
        setInputText('我想要学习关于洛阳的历史');
        setIsListening(false);
      }, 2000);
    }
  };

  const quickReplies = isCyberpunk
    ? ['讲个故事 ⚡', '文化扫描 🔍', '任务列表 📡', '数据记录 📊']
    : ['讲个故事 📖', '文化探索 🏛️', '今日任务 ✅', '成长记录 📊'];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={springConfig}
            className="absolute bottom-20 right-0 w-[380px] h-[540px] flex flex-col overflow-hidden"
            style={{
              background: isCyberpunk ? 'rgba(10, 10, 20, 0.9)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              borderRadius: isCyberpunk ? '16px' : '24px',
              border: isCyberpunk ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: isCyberpunk
                ? '0 0 30px rgba(0, 240, 255, 0.2), 0 20px 60px rgba(0, 0, 0, 0.5)'
                : '0 20px 60px rgba(16, 185, 129, 0.15), 0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex justify-between items-center shrink-0 relative overflow-hidden"
              style={{
                background: isCyberpunk
                  ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(255, 0, 255, 0.7))'
                  : 'linear-gradient(135deg, #10b981, #059669, #047857)',
                borderRadius: isCyberpunk ? '16px 16px 0 0' : '24px 24px 0 0',
              }}
            >
              <div className="absolute inset-0 shimmer pointer-events-none opacity-30" />
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-11 h-11 rounded-2xl overflow-hidden shadow-lg shrink-0 ${
                  isCyberpunk ? 'border-2 border-[rgba(0,240,255,0.4)] bg-[rgba(0,0,0,0.3)]' : 'border-2 border-white/40 bg-white/10'
                }`}>
                  <img src={xiaoyuAvatarImage} alt="小语" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base" style={{ fontWeight: 600, lineHeight: 1.3, color: isCyberpunk ? '#0a0a0f' : 'white' }}>
                    小语AI助手
                  </h3>
                  <p className="text-xs" style={{ color: isCyberpunk ? 'rgba(10,10,15,0.7)' : 'rgba(236,253,245,1)' }}>
                    {isListening ? '信号接收中...' : isThinking ? '处理中...' : isCyberpunk ? '系统就绪 ⚡' : '随时为您服务 🌿'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center relative z-10 transition-colors ${
                  isCyberpunk ? 'bg-black/20 hover:bg-black/30' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <X size={16} style={{ color: isCyberpunk ? '#0a0a0f' : 'white' }} />
              </motion.button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 glass-scroll">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className={`w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-sm ${
                      isCyberpunk ? 'border border-[rgba(0,240,255,0.3)]' : 'border border-white/40'
                    }`}>
                      <img src={xiaoyuAvatarImage} alt="小语" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] p-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-tr-lg'
                        : 'rounded-2xl rounded-tl-lg'
                    }`}
                    style={
                      msg.role === 'user'
                        ? {
                            background: isCyberpunk
                              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(0, 180, 220, 0.8))'
                              : 'linear-gradient(135deg, #10b981, #059669)',
                            color: isCyberpunk ? '#0a0a0f' : 'white',
                            boxShadow: isCyberpunk
                              ? '0 0 15px rgba(0, 240, 255, 0.3)'
                              : '0 4px 15px rgba(16, 185, 129, 0.25)',
                          }
                        : {
                            background: isCyberpunk ? 'rgba(10, 10, 20, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: isCyberpunk ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.6)',
                            color: isCyberpunk ? '#c0c0e0' : '#374151',
                            boxShadow: isCyberpunk ? '0 0 8px rgba(0, 240, 255, 0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0">
                    <img src={xiaoyuAvatarImage} alt="小语" className="w-full h-full object-cover" />
                  </div>
                  <div
                    className="p-3 rounded-2xl rounded-tl-lg"
                    style={{
                      background: isCyberpunk ? 'rgba(10, 10, 20, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: isCyberpunk ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full ${isCyberpunk ? 'bg-[#00f0ff]' : 'bg-emerald-400'}`}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          style={isCyberpunk ? { boxShadow: '0 0 6px rgba(0, 240, 255, 0.5)' } : undefined}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 shrink-0">
              <div className="flex gap-2 overflow-x-auto glass-scroll pb-1">
                {quickReplies.map((reply) => (
                  <motion.button
                    key={reply}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const cleanReply = reply.replace(/\s*[📖🏛️✅📊⚡🔍📡]/g, '').trim();
                      setInputText(cleanReply);
                      setTimeout(() => {
                        const newMsg: ChatMessage = {
                          id: Date.now().toString(),
                          role: 'user',
                          content: cleanReply,
                          timestamp: Date.now(),
                        };
                        setMessages((prev) => [...prev, newMsg]);
                        setIsThinking(true);
                        setTimeout(() => {
                          const aiResponse: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            role: 'assistant',
                            content: getAIResponse(reply),
                            timestamp: Date.now(),
                          };
                          setMessages((prev) => [...prev, aiResponse]);
                          setIsThinking(false);
                        }, 800);
                        setInputText('');
                      }, 100);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors backdrop-blur-sm ${
                      isCyberpunk
                        ? 'bg-[rgba(0,240,255,0.08)] text-[#00f0ff] border border-[rgba(0,240,255,0.2)] hover:bg-[rgba(0,240,255,0.15)]'
                        : 'bg-emerald-50/80 text-emerald-600 border border-emerald-100/60 hover:bg-emerald-100/80'
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 shrink-0" style={{ borderTop: isCyberpunk ? '1px solid rgba(0,240,255,0.15)' : '1px solid rgba(255,255,255,0.5)' }}>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isListening
                      ? isCyberpunk
                        ? 'bg-[rgba(255,0,68,0.2)] text-[#ff0044] border border-[rgba(255,0,68,0.3)]'
                        : 'bg-red-100/80 text-red-500 border border-red-200/50'
                      : isCyberpunk
                        ? 'bg-[rgba(0,240,255,0.08)] text-[#00f0ff] border border-[rgba(0,240,255,0.2)] hover:bg-[rgba(0,240,255,0.15)]'
                        : 'bg-white/50 text-gray-500 border border-white/60 hover:bg-white/70'
                  }`}
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                </motion.button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isCyberpunk ? '输入指令...' : '输入消息...'}
                  className="glass-input flex-1 px-4 py-2.5 text-sm outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="glass-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
                >
                  <Send size={16} className="relative z-10" style={{ color: isCyberpunk ? '#0a0a0f' : 'white' }} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="ai-pulse-btn w-[68px] h-[68px] rounded-2xl flex items-center justify-center relative z-50 overflow-hidden p-0"
        style={{
          background: isCyberpunk
            ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(255, 0, 255, 0.7))'
            : 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: isCyberpunk
            ? '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.2)'
            : '0 8px 30px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          border: isCyberpunk ? '2px solid rgba(0, 240, 255, 0.5)' : '2px solid rgba(255,255,255,0.5)',
        }}
      >
        <img
          src={aiFloatButtonImage}
          alt="小语AI"
          className="w-full h-full object-cover rounded-xl"
        />
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isCyberpunk
              ? 'bg-[#00f0ff] border-[rgba(0,0,0,0.3)]'
              : 'bg-emerald-400 border-white'
          }`}
          style={isCyberpunk ? { boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)' } : undefined}
        >
          {isCyberpunk ? <Zap size={10} className="text-black" /> : <Sparkles size={10} className="text-white" />}
        </motion.span>
      </motion.button>
    </div>
  );
};
