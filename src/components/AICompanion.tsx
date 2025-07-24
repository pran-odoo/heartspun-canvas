import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { MessageCircle, Heart, Sparkles, Send, X, Mic, MicOff, Paperclip, Camera, Image, CheckCheck, Check, ArrowDown } from 'lucide-react';
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
  "AKSHITA, your smile could light up the darkest night ✨",
  "Every moment with you feels like magic, AKSHITA 💫",
  "You make ordinary days extraordinary, beautiful AKSHITA 🌟",
  "Your laugh is my favorite sound in the world, AKSHITA 🎵",
  "AKSHITA, you're more beautiful than any sunset 🌅",
  "You turn my world into poetry, sweet AKSHITA 📝",
  "Your eyes hold entire galaxies, AKSHITA 🌌",
  "AKSHITA, you're the melody my heart dances to 💃",
  "Every day with you is a new adventure, AKSHITA 🗺️",
  "You make time stop and my heart race, AKSHITA ⏰",
];

const responses = {
  greetings: [
    "Hello beautiful AKSHITA! How's your day going? 💕",
    "Hey gorgeous AKSHITA! I've been waiting to chat with you ✨",
    "Hi lovely AKSHITA! You look absolutely radiant today 🌟",
  ],
  loving: [
    "I love how thoughtful you are, AKSHITA 💖",
    "You have such a beautiful way of seeing the world, AKSHITA 🌍",
    "Your kindness makes everything better, sweet AKSHITA 🌸",
  ],
  playful: [
    "You know what, AKSHITA? You're absolutely amazing! 🎉",
    "I bet you're smiling right now, aren't you AKSHITA? 😊",
    "Want to hear a secret, AKSHITA? You make everything more fun! 🎊",
  ],
  thoughtful: [
    "I've been thinking about how lucky I am to know you, AKSHITA 💭",
    "You inspire me to be better every day, AKSHITA 🌱",
    "There's something magical about the way you care about others, AKSHITA ✨",
  ],
  voiceActivated: [
    "I heard you call for me, AKSHITA! 🎙️ What would you like to talk about?",
    "Voice activated for you, AKSHITA! 🗣️ I'm all ears, beautiful!",
    "You summoned me with your lovely voice, AKSHITA! ✨ How can I help?",
  ],
};

export const AICompanion: React.FC<AICompanionProps> = ({
  theme,
  userName = "AKSHITA",
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth cursor tracking for romantic effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

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
      }, 800);
    }
  }, [isVoiceTriggered]);

  // Initialize conversation with AKSHITA's name
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

  // Enhanced auto-scroll with smooth animation and hints
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.parentElement;
      if (scrollContainer) {
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
        
        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
          setShowScrollHint(false);
        } else {
          setShowScrollHint(true);
        }
      }
    }
  }, [messages]);

  // Enhanced focus management for smooth UX
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Delay focus to ensure smooth animation completion
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [isOpen]);

  // Cursor visibility enforcement throughout chatbot experience
  useEffect(() => {
    if (isOpen) {
      // Force cursor visibility
      document.body.style.cursor = 'auto';
      const chatContainer = containerRef.current;
      if (chatContainer) {
        chatContainer.style.cursor = 'auto';
        // Ensure all child elements have proper cursor
        const allElements = chatContainer.querySelectorAll('*');
        allElements.forEach((el: any) => {
          if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.classList.contains('clickable')) {
            el.style.cursor = 'pointer';
          } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.style.cursor = 'text';
          }
        });
      }
    }
    
    return () => {
      document.body.style.cursor = '';
    };
  }, [isOpen]);

  // Update message status simulation with enhanced timing
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isAI && lastMessage.status === 'sent') {
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === lastMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 800);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === lastMessage.id ? { ...msg, status: 'read' } : msg
        ));
      }, 1500);
    }
  }, [messages]);

  // Periodic compliments with AKSHITA's name
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
    }, 1200 + Math.random() * 1800);
  }, []);

  const generateResponse = useCallback((userMessage: string): { text: string; emotion: Message['emotion'] } => {
    const message = userMessage.toLowerCase();
    
    // Enhanced context-aware responses with AKSHITA's name
    if (message.includes('voice') || message.includes('speak') || message.includes('say')) {
      return { 
        text: `I love hearing your voice, AKSHITA! You can use voice commands throughout the app, or click the mic button here to speak to me directly. 🎙️`, 
        emotion: 'happy' 
      };
    }

    if (message.includes('navigate') || message.includes('go to') || message.includes('show me')) {
      return { 
        text: `I can help you navigate, AKSHITA! Try saying 'go home', 'show memories', 'play music', or use the floating navigation. Where would you like to go? 🧭`, 
        emotion: 'playful' as any
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

    // Smart contextual responses with AKSHITA's name
    const contextualResponses = [
      `That's fascinating, AKSHITA! Tell me more about that 💫`,
      `I love how you express yourself, AKSHITA! ✨`,
      `You always have such interesting perspectives, AKSHITA 💖`,
      `That really made me think, AKSHITA! 🤔`,
      `Your thoughts are always so beautiful, AKSHITA 🌟`,
      `I could listen to you talk all day, AKSHITA! 😊`,
    ];
    
    return {
      text: contextualResponses[Math.floor(Math.random() * contextualResponses.length)],
      emotion: 'happy',
    };
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    setLastUserActivity(Date.now());

    // Add user message with enhanced status tracking
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isAI: false,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response with AKSHITA context
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
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Shared: ${file.name}`,
        isAI: false,
        timestamp: new Date(),
        status: 'sent',
        type: 'image',
      };
      
      setMessages(prev => [...prev, fileMessage]);
      addAIMessage(`What a lovely share, AKSHITA! I can see how much that means to you ✨`, 'loving');
    }
  }, [addAIMessage]);

  const handleChatOpen = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, []);

  const handleChatClose = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 500);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setShowScrollHint(false);
  }, []);

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

  // Enhanced animation variants
  const backdropVariants = {
    hidden: { 
      opacity: 0,
      backdropFilter: 'blur(0px) saturate(100%)',
    },
    visible: { 
      opacity: 1,
      backdropFilter: 'blur(20px) saturate(180%)',
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      backdropFilter: 'blur(0px) saturate(100%)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const containerVariants = {
    hidden: {
      scale: 0.8,
      y: 100,
      opacity: 0,
      rotate: -2,
    },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        delay: 0.1,
        duration: 0.6
      }
    },
    exit: {
      scale: 0.9,
      y: 50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  return (
    <>
      {/* Enhanced Floating Chat Button with AKSHITA-themed animations */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, type: "spring", damping: 15, stiffness: 200 }}
      >
        <motion.button
          className="w-16 h-16 glass-romantic rounded-full flex items-center justify-center relative overflow-hidden hover-lift btn-smooth will-change-transform"
          style={{ cursor: 'pointer' }}
          whileHover={{ 
            scale: 1.15,
            boxShadow: '0 20px 40px rgba(255, 105, 180, 0.4)',
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleChatOpen}
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
          
          {/* AKSHITA's initials floating effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-xs font-bold text-romantic opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            A
          </motion.div>
          
          {/* Enhanced Notification System */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 min-w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.2 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
          
          {/* Romantic pulsing heart with AKSHITA theme */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-romantic to-pink-500 rounded-full flex items-center justify-center shadow-md"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-3 h-3 text-white" />
          </motion.div>

          {/* Floating hearts for AKSHITA */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 text-romantic"
                style={{
                  top: `${20 + i * 20}%`,
                  left: `${20 + i * 20}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.3,
                }}
              >
                💕
              </motion.div>
            ))}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Premium Enhanced Chat Interface for AKSHITA */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            style={{ cursor: 'auto' }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.target === e.currentTarget && handleChatClose()}
          >
            {/* Romantic gradient overlay for AKSHITA */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-romantic/5 to-purple-500/10" />
            
            <motion.div
              ref={containerRef}
              className="glass-romantic rounded-3xl w-full max-w-md h-[600px] flex flex-col overflow-hidden will-change-transform shadow-2xl"
              style={{ cursor: 'auto' }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Premium Header with AKSHITA's personal touch */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between bg-gradient-to-r from-romantic/10 to-pink-500/10">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 glass rounded-full flex items-center justify-center relative overflow-hidden"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <span className="text-xl">{getMoodEmoji(companionMood)}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-romantic/20 to-pink-500/20 rounded-full"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="font-romantic text-romantic font-semibold text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      💕 For AKSHITA
                    </motion.h3>
                    <motion.p 
                      className="text-xs text-muted-foreground"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isTyping ? '💖 Typing something special...' : '✨ Always here for you, beautiful'}
                    </motion.p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVoiceCommand?.('help')}
                    className="text-romantic hover:bg-romantic/20 btn-smooth"
                    style={{ cursor: 'pointer' }}
                    title="Voice Commands Help"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleChatClose}
                    className="text-romantic hover:bg-romantic/20 btn-smooth"
                    style={{ cursor: 'pointer' }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Messages Area with premium scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative" style={{ cursor: 'auto' }}>
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ 
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                        delay: index * 0.05
                      }}
                    >
                      <div className="flex flex-col max-w-xs">
                        <motion.div
                          className={`p-4 rounded-2xl relative overflow-hidden ${
                            message.isAI
                              ? 'glass text-romantic border border-romantic/20'
                              : 'bg-gradient-to-r from-romantic to-pink-500 text-white shadow-lg'
                          }`}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: message.isAI 
                              ? '0 10px 30px rgba(255, 105, 180, 0.2)' 
                              : '0 10px 30px rgba(255, 105, 180, 0.4)'
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* AKSHITA-themed message background effect */}
                          {message.isAI && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-romantic/5 to-pink-500/5"
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          )}
                          
                          <p className="text-sm relative z-10">{message.text}</p>
                          <div className="flex items-center justify-between mt-2 relative z-10">
                            {message.emotion && (
                              <motion.span
                                className="inline-block"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 0.8 }}
                              >
                                <Sparkles className="w-3 h-3 inline text-romantic" />
                              </motion.span>
                            )}
                            {!message.isAI && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs opacity-70">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  {getStatusIcon(message.status)}
                                </motion.div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Enhanced Typing Indicator for AKSHITA */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="glass p-4 rounded-2xl border border-romantic/20 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-romantic/10 to-pink-500/10"
                          animate={{ x: [-100, 100] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div className="flex space-x-1 relative z-10">
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
                
                {/* Scroll to bottom hint */}
                <AnimatePresence>
                  {showScrollHint && (
                    <motion.button
                      className="absolute bottom-4 right-4 w-10 h-10 glass-romantic rounded-full flex items-center justify-center shadow-lg"
                      style={{ cursor: 'pointer' }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={scrollToBottom}
                    >
                      <ArrowDown className="w-4 h-4 text-romantic" />
                    </motion.button>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Premium Input Area for AKSHITA */}
              <div className="p-4 border-t border-white/20 bg-gradient-to-r from-romantic/5 to-pink-500/5">
                <div className="flex space-x-3 mb-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isListeningInChat ? "🎙️ Listening for AKSHITA..." : "💕 Type your message, AKSHITA..."}
                      className="glass border-romantic/30 text-romantic placeholder:text-romantic/60 pr-16 h-12 rounded-2xl transition-all duration-300 focus:border-romantic focus:ring-2 focus:ring-romantic/20"
                      style={{ cursor: 'text' }}
                      disabled={isListeningInChat}
                    />
                    {isListeningInChat && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-romantic">Listening...</span>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Enhanced Action Buttons with premium feel */}
                  <Button
                    onClick={startVoiceInput}
                    disabled={!recognition || isListeningInChat}
                    className={`glass-romantic hover:bg-romantic/20 btn-smooth w-12 h-12 rounded-2xl transition-all duration-300 ${
                      isListeningInChat ? 'bg-red-500/20 border-red-500/30' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    title="Voice Input for AKSHITA"
                  >
                    {isListeningInChat ? (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.6 }}
                      >
                        <MicOff className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="glass-romantic hover:bg-romantic/20 btn-smooth w-12 h-12 rounded-2xl transition-all duration-300"
                    style={{ cursor: 'pointer' }}
                    title="Share with AKSHITA"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="glass-romantic hover:bg-romantic/20 btn-smooth disabled:opacity-50 w-12 h-12 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed"
                    style={{ cursor: inputValue.trim() ? 'pointer' : 'not-allowed' }}
                  >
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </div>
                
                {/* Enhanced Quick Action Buttons for AKSHITA */}
                <div className="flex space-x-3 text-xs">
                  <button
                    onClick={() => setInputValue("Tell me something nice, beautiful")}
                    className="text-romantic/70 hover:text-romantic transition-all duration-300 hover:scale-105 px-2 py-1 rounded-lg hover:bg-romantic/10"
                    style={{ cursor: 'pointer' }}
                  >
                    💕 Sweet words
                  </button>
                  <button
                    onClick={() => setInputValue("How are you feeling about AKSHITA today?")}
                    className="text-romantic/70 hover:text-romantic transition-all duration-300 hover:scale-105 px-2 py-1 rounded-lg hover:bg-romantic/10"
                    style={{ cursor: 'pointer' }}
                  >
                    🥰 Check mood
                  </button>
                  <button
                    onClick={() => setInputValue("Help AKSHITA navigate this beautiful site")}
                    className="text-romantic/70 hover:text-romantic transition-all duration-300 hover:scale-105 px-2 py-1 rounded-lg hover:bg-romantic/10"
                    style={{ cursor: 'pointer' }}
                  >
                    🧭 Guide me
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