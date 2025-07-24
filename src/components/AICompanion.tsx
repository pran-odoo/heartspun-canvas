import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Sparkles, Send, X, Mic, MicOff, Paperclip, Camera, Image, CheckCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  emotion?: 'happy' | 'loving' | 'playful' | 'thoughtful';
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'voice' | 'image';
}

interface AICompanionProps {
  theme: 'morning' | 'evening' | 'night';
  userName?: string;
  isVoiceTriggered?: boolean;
  onVoiceCommand?: (command: string) => void;
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
  voiceActivated: [
    "I heard you call for me! 🎙️ What would you like to talk about?",
    "Voice activated! 🗣️ I'm all ears, beautiful!",
    "You summoned me with your lovely voice! ✨ How can I help?",
  ],
};

export const AICompanion: React.FC<AICompanionProps> = ({
  theme,
  userName = "Beautiful",
  isVoiceTriggered = false,
  onVoiceCommand,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [companionMood, setCompanionMood] = useState<'happy' | 'loving' | 'playful' | 'thoughtful'>('happy');
  const [isListeningInChat, setIsListeningInChat] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastUserActivity, setLastUserActivity] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize speech recognition for chat
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListeningInChat(false);
      };

      recognitionInstance.onerror = () => {
        setIsListeningInChat(false);
      };

      recognitionInstance.onend = () => {
        setIsListeningInChat(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Handle voice trigger from external voice navigation
  useEffect(() => {
    if (isVoiceTriggered && !isOpen) {
      setIsOpen(true);
      const voiceGreeting = responses.voiceActivated[Math.floor(Math.random() * responses.voiceActivated.length)];
      setTimeout(() => {
        addAIMessage(voiceGreeting, 'happy');
      }, 500);
    }
  }, [isVoiceTriggered]);

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
        status: 'read',
      }]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);

  // Update message status simulation
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isAI && lastMessage.status === 'sent') {
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === lastMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === lastMessage.id ? { ...msg, status: 'read' } : msg
        ));
      }, 2000);
    }
  }, [messages]);

  // Periodic compliments and unread counter
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        if (Date.now() - lastUserActivity > 60000 && Math.random() < 0.3) {
          const compliment = compliments[Math.floor(Math.random() * compliments.length)];
          addAIMessage(compliment, 'loving');
          setUnreadCount(prev => prev + 1);
        }
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [isOpen, lastUserActivity]);

  const addAIMessage = useCallback((text: string, emotion: Message['emotion'] = 'happy') => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isAI: true,
        timestamp: new Date(),
        emotion,
        status: 'read',
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      setCompanionMood(emotion || 'happy');
    }, 1000 + Math.random() * 2000);
  }, []);

  const generateResponse = useCallback((userMessage: string): { text: string; emotion: Message['emotion'] } => {
    const message = userMessage.toLowerCase();
    
    // Enhanced context-aware responses
    if (message.includes('voice') || message.includes('speak') || message.includes('say')) {
      return { 
        text: "I love hearing your voice! You can use voice commands throughout the app, or click the mic button here to speak to me directly. 🎙️", 
        emotion: 'happy' 
      };
    }

    if (message.includes('navigate') || message.includes('go to') || message.includes('show me')) {
      return { 
        text: "I can help you navigate! Try saying 'go home', 'show memories', 'play music', or use the floating navigation. Where would you like to go? 🧭", 
        emotion: 'helpful' as any
      };
    }
    
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

    // Smart contextual responses
    const contextualResponses = [
      `That's fascinating, ${userName}! Tell me more about that 💫`,
      `I love how you express yourself! ✨`,
      `You always have such interesting perspectives 💖`,
      `That really made me think! 🤔`,
      `Your thoughts are always so beautiful 🌟`,
      `I could listen to you talk all day! 😊`,
    ];
    
    return {
      text: contextualResponses[Math.floor(Math.random() * contextualResponses.length)],
      emotion: 'happy',
    };
  }, [userName]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    setLastUserActivity(Date.now());

    // Add user message with status tracking
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isAI: false,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const { text, emotion } = generateResponse(inputValue);
    addAIMessage(text, emotion);
    
    setInputValue('');
  }, [inputValue, generateResponse, addAIMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const startVoiceInput = useCallback(() => {
    if (recognition) {
      setIsListeningInChat(true);
      recognition.start();
    }
  }, [recognition]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file sharing
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Shared: ${file.name}`,
        isAI: false,
        timestamp: new Date(),
        status: 'sent',
        type: 'image',
      };
      
      setMessages(prev => [...prev, fileMessage]);
      addAIMessage("What a lovely share! I can see how much that means to you ✨", 'loving');
    }
  }, [addAIMessage]);

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'loving': return '🥰';
      case 'playful': return '😄';
      case 'thoughtful': return '🤔';
      default: return '😊';
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent': return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-romantic" />;
      default: return null;
    }
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <motion.button
          className="w-16 h-16 glass-romantic rounded-full flex items-center justify-center relative overflow-hidden hover-lift btn-smooth will-change-transform"
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
          
          {/* Enhanced Notification System */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 min-w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
          
          {/* Pulsing heart indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-romantic rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-2 h-2 text-white" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Enhanced Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              className="glass-romantic rounded-3xl w-full max-w-md h-[500px] flex flex-col overflow-hidden will-change-transform"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Enhanced Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 glass rounded-full flex items-center justify-center"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-lg">{getMoodEmoji(companionMood)}</span>
                  </motion.div>
                  <div>
                    <h3 className="font-romantic text-romantic font-semibold">AI Companion</h3>
                    <motion.p 
                      className="text-xs text-muted-foreground"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isTyping ? 'Typing...' : 'Always here for you'}
                    </motion.p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVoiceCommand?.('help')}
                    className="text-romantic hover:bg-romantic/20"
                    title="Voice Commands Help"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-romantic hover:bg-romantic/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ 
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                        delay: index * 0.05
                      }}
                    >
                      <div className="flex flex-col max-w-xs">
                        <motion.div
                          className={`p-3 rounded-2xl ${
                            message.isAI
                              ? 'glass text-romantic'
                              : 'bg-romantic text-white'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-between mt-1">
                            {message.emotion && (
                              <motion.span
                                className="inline-block"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                              >
                                <Sparkles className="w-3 h-3 inline text-romantic" />
                              </motion.span>
                            )}
                            {!message.isAI && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs opacity-60">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {getStatusIcon(message.status)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Enhanced Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="glass p-3 rounded-2xl">
                        <motion.div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-romantic rounded-full"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-white/20">
                <div className="flex space-x-2 mb-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isListeningInChat ? "Listening..." : "Type your message..."}
                      className="glass border-white/20 text-romantic placeholder:text-romantic/60 pr-12"
                      disabled={isListeningInChat}
                    />
                    {isListeningInChat && (
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <Button
                    onClick={startVoiceInput}
                    disabled={!recognition || isListeningInChat}
                    className={`glass-romantic hover:bg-romantic/20 btn-smooth ${
                      isListeningInChat ? 'bg-red-500/20' : ''
                    }`}
                    title="Voice Input"
                  >
                    {isListeningInChat ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                        <MicOff className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="glass-romantic hover:bg-romantic/20 btn-smooth"
                    title="Share File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="glass-romantic hover:bg-romantic/20 btn-smooth disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="flex space-x-2 text-xs">
                  <button
                    onClick={() => setInputValue("Tell me something nice")}
                    className="text-romantic/60 hover:text-romantic transition-colors"
                  >
                    💕 Compliment
                  </button>
                  <button
                    onClick={() => setInputValue("How are you feeling?")}
                    className="text-romantic/60 hover:text-romantic transition-colors"
                  >
                    🤔 Check mood
                  </button>
                  <button
                    onClick={() => setInputValue("Help me navigate")}
                    className="text-romantic/60 hover:text-romantic transition-colors"
                  >
                    🧭 Navigation help
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};