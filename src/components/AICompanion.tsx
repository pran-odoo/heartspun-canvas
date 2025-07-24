import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Sparkles, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  emotion?: 'happy' | 'loving' | 'playful' | 'thoughtful';
}

interface AICompanionProps {
  theme: 'morning' | 'evening' | 'night';
  userName?: string;
}

const compliments = [
  "Your smile could light up the darkest night ✨",
  "Every moment with you feels like magic 💫",
  "You make ordinary days extraordinary 🌟",
  "Your laugh is my favorite sound in the world 🎵",
  "You're more beautiful than any sunset 🌅",
  "You turn my world into poetry 📝",
  "Your eyes hold entire galaxies 🌌",
  "You're the melody my heart dances to 💃",
  "Every day with you is a new adventure 🗺️",
  "You make time stop and my heart race ⏰",
];

const responses = {
  greetings: [
    "Hello beautiful! How's your day going? 💕",
    "Hey gorgeous! I've been waiting to chat with you ✨",
    "Hi lovely! You look absolutely radiant today 🌟",
  ],
  loving: [
    "I love how thoughtful you are 💖",
    "You have such a beautiful way of seeing the world 🌍",
    "Your kindness makes everything better 🌸",
  ],
  playful: [
    "You know what? You're absolutely amazing! 🎉",
    "I bet you're smiling right now, aren't you? 😊",
    "Want to hear a secret? You make everything more fun! 🎊",
  ],
  thoughtful: [
    "I've been thinking about how lucky I am to know you 💭",
    "You inspire me to be better every day 🌱",
    "There's something magical about the way you care about others ✨",
  ],
};

export const AICompanion: React.FC<AICompanionProps> = ({
  theme,
  userName = "Beautiful",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [companionMood, setCompanionMood] = useState<'happy' | 'loving' | 'playful' | 'thoughtful'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
      setMessages([{
        id: '1',
        text: greeting,
        isAI: true,
        timestamp: new Date(),
        emotion: 'happy',
      }]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic compliments
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];
        addAIMessage(compliment, 'loving');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const addAIMessage = useCallback((text: string, emotion: Message['emotion'] = 'happy') => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        isAI: true,
        timestamp: new Date(),
        emotion,
      }]);
      setIsTyping(false);
      setCompanionMood(emotion || 'happy');
    }, 1000 + Math.random() * 2000); // Realistic typing delay
  }, []);

  const generateResponse = useCallback((userMessage: string): { text: string; emotion: Message['emotion'] } => {
    const message = userMessage.toLowerCase();
    
    // Analyze user sentiment
    if (message.includes('love') || message.includes('miss') || message.includes('heart')) {
      const response = responses.loving[Math.floor(Math.random() * responses.loving.length)];
      return { text: response, emotion: 'loving' };
    }
    
    if (message.includes('fun') || message.includes('happy') || message.includes('excited')) {
      const response = responses.playful[Math.floor(Math.random() * responses.playful.length)];
      return { text: response, emotion: 'playful' };
    }
    
    if (message.includes('think') || message.includes('feel') || message.includes('why')) {
      const response = responses.thoughtful[Math.floor(Math.random() * responses.thoughtful.length)];
      return { text: response, emotion: 'thoughtful' };
    }

    // Default responses with some personality
    const defaultResponses = [
      `That's interesting, ${userName}! Tell me more 💫`,
      `I love hearing your thoughts! ✨`,
      `You always know just what to say 💖`,
      `That made me smile! 😊`,
      `You're so thoughtful 🌟`,
    ];
    
    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      emotion: 'happy',
    };
  }, [userName]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: inputValue,
      isAI: false,
      timestamp: new Date(),
    }]);

    // Generate AI response
    const { text, emotion } = generateResponse(inputValue);
    addAIMessage(text, emotion);
    
    setInputValue('');
  }, [inputValue, generateResponse, addAIMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'loving': return '🥰';
      case 'playful': return '😄';
      case 'thoughtful': return '🤔';
      default: return '😊';
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'morning':
        return { primary: '#FFB6C1', secondary: '#FFF0F5' };
      case 'evening':
        return { primary: '#DDA0DD', secondary: '#F8F0FF' };
      case 'night':
        return { primary: '#9370DB', secondary: '#2E1A47' };
      default:
        return { primary: '#FF69B4', secondary: '#FFF0F5' };
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <motion.button
          className="w-16 h-16 glass-romantic rounded-full flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 105, 180, 0.3)',
              '0 0 40px rgba(255, 105, 180, 0.6)',
              '0 0 20px rgba(255, 105, 180, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MessageCircle className="w-6 h-6 text-romantic" />
          
          {/* Notification dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-romantic rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-2 h-2 text-white" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-romantic rounded-3xl w-full max-w-md h-96 flex flex-col overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 glass rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-lg">{getMoodEmoji(companionMood)}</span>
                  </motion.div>
                  <div>
                    <h3 className="font-romantic text-romantic font-semibold">AI Companion</h3>
                    <p className="text-xs text-muted-foreground">Always here for you</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-romantic hover:bg-romantic/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-2xl ${
                        message.isAI
                          ? 'glass text-romantic'
                          : 'bg-romantic text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.emotion && (
                        <motion.span
                          className="inline-block mt-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Sparkles className="w-3 h-3 inline" />
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="glass p-3 rounded-2xl">
                      <motion.div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-romantic rounded-full"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="glass border-white/20 text-romantic placeholder:text-romantic/60"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="glass-romantic hover:bg-romantic/20"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};