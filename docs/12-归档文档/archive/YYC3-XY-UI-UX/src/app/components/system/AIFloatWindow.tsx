import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RobotOutlined, CloseOutlined, SendOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export interface AIFloatWindowProps {
  initialPosition?: { x: number; y: number };
  size?: { width: number; height: number };
  theme?: 'light' | 'dark';
  onInteraction?: (type: string, data?: any) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const AIFloatWindow: React.FC<AIFloatWindowProps> = ({
  initialPosition = { x: window.innerWidth - 80, y: window.innerHeight - 80 },
  size = { width: 60, height: 60 },
  theme = 'light',
  onInteraction,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是小语，你的AI成长伙伴。有什么我可以帮你的吗？',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    onInteraction?.('send-message', newMessage);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `我收到了你说的话："${inputText}"。这是一个很好的观点！我们可以一起探索更多关于这方面的内容。`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
      // Simulate voice recognition start
      setTimeout(() => {
        setInputText('我想要学习关于洛阳的历史');
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <RobotOutlined className="text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-lg leading-tight">小语AI助手</h3>
                  <p className="text-xs text-white/80">
                    {isListening ? '正在聆听...' : '随时为您服务'}
                  </p>
                </div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined className="text-white text-lg" />}
                onClick={() => setIsExpanded(false)}
                className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center p-0"
              />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                 <Button
                  shape="circle"
                  icon={isListening ? <AudioOutlined className="animate-pulse text-red-500" /> : <AudioOutlined />}
                  onClick={toggleListening}
                  className={isListening ? 'border-red-200 bg-red-50' : ''}
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="输入消息..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  />
                </div>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  className="bg-purple-600 hover:bg-purple-700 border-none shadow-md shadow-purple-200"
                  disabled={!inputText.trim()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow relative z-50"
      >
        <RobotOutlined className="text-2xl" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      </motion.button>
    </div>
  );
};
