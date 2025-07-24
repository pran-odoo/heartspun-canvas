import React, { useState, useEffect, useCallback } from 'react';
import { ParticleSystem } from '@/components/ParticleSystem';
import { ThemeController } from '@/components/ThemeController';
import { HeroSection } from '@/components/HeroSection';
import { MemoryTimeline } from '@/components/MemoryTimeline';
import { CursorEffects } from '@/components/CursorEffects';
import { PersonalizationEngine } from '@/components/PersonalizationEngine';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { AICompanion } from '@/components/AICompanion';
import { MusicSystem } from '@/components/MusicSystem';
import { BiometricAwareness } from '@/components/BiometricAwareness';
import { Enhanced3DEffects } from '@/components/Enhanced3DEffects';
import { VoiceNavigation } from '@/components/VoiceNavigation';
import { TargetCursor } from '@/components/TargetCursor';
import { SurpriseGenerator } from '@/components/SurpriseGenerator';
import { ReactBitsLightning } from '@/components/ReactBitsLightning';
import { MemoryEditModal } from '@/components/MemoryEditModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Heart, MapPin, Calendar } from 'lucide-react';

const Index = () => {
  const [currentTheme, setCurrentTheme] = useState<'morning' | 'evening' | 'night'>('morning');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [userPreferences, setUserPreferences] = useState({});
  const [currentMood, setCurrentMood] = useState('romantic');
  const [beatIntensity, setBeatIntensity] = useState(0);
  const [biometricData, setBiometricData] = useState({});
  const [isVoiceTriggeredChat, setIsVoiceTriggeredChat] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memories, setMemories] = useState([
    {
      id: '1',
      title: 'Our First Date',
      description: 'The most magical evening with AKSHITA, where everything began...',
      date: '2024-01-15',
      location: 'Sunset Café',
      photos: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      tags: ['romantic', 'first-date', 'special']
    },
    {
      id: '2', 
      title: 'Dancing Under Stars',
      description: 'AKSHITA looked absolutely stunning as we danced under the starlit sky...',
      date: '2024-02-14',
      location: 'Rose Garden',
      photos: ['/api/placeholder/300/200'],
      tags: ['dance', 'stars', 'valentine']
    },
    {
      id: '3',
      title: 'Beach Sunrise',
      description: 'Watching the sunrise with AKSHITA, the most peaceful moment of my life...',
      date: '2024-03-20',
      location: 'Golden Beach',
      photos: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
      tags: ['sunrise', 'beach', 'peaceful']
    }
  ]);

  // Mouse tracking for particle system
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Auto-detect time-based theme
  const getTimeBasedTheme = useCallback((): 'morning' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) return 'morning';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }, []);

  // Initialize theme and mouse tracking
  useEffect(() => {
    const initialTheme = getTimeBasedTheme();
    setCurrentTheme(initialTheme);
    
    // Apply initial theme to document
    document.documentElement.classList.add(initialTheme);
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [getTimeBasedTheme, handleMouseMove]);

  // Enhanced voice command handler
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);
    
    // Handle theme commands
    if (command.startsWith('theme-')) {
      const theme = command.replace('theme-', '') as 'morning' | 'evening' | 'night';
      handleThemeChange(theme);
      return;
    }

    // Handle special commands
    switch (command) {
      case 'love-response':
        console.log('💕 Love response triggered');
        break;
      case 'compliment-response':
        console.log('🌟 Compliment response triggered');
        break;
      case 'nice-message':
        console.log('✨ Nice message triggered');
        break;
      case 'help':
        console.log('❓ Help triggered');
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  }, []);

  // Handle chat opening from voice commands
  const handleVoiceChatOpen = useCallback(() => {
    setIsVoiceTriggeredChat(true);
    // Reset the trigger after a short delay
    setTimeout(() => {
      setIsVoiceTriggeredChat(false);
    }, 1000);
  }, []);

  // Theme change handler with smooth transitions
  const handleThemeChange = (theme: 'morning' | 'evening' | 'night') => {
    // Add smooth transition class before changing theme
    document.documentElement.classList.add('theme-transition');
    
    // Remove old theme classes
    document.documentElement.classList.remove('morning', 'evening', 'night');
    
    // Add new theme class with a slight delay for smooth transition
    setTimeout(() => {
      document.documentElement.classList.add(theme);
      setCurrentTheme(theme);
    }, 50);

    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 550);
  };

  // Enhanced navigation handler with smooth scrolling
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    
    // Smooth scroll to section with enhanced options
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Add visual feedback for section transition
      element.classList.add('section-enter');
      setTimeout(() => {
        element.classList.add('section-enter-active');
        element.classList.remove('section-enter');
      }, 50);
      
      // Clean up classes after transition
      setTimeout(() => {
        element.classList.remove('section-enter-active');
      }, 500);
    }
  };

  // Music mood change handler
  const handleMoodChange = useCallback((mood: string) => {
    setCurrentMood(mood);
  }, []);

  // Biometric data handler
  const handleBiometricUpdate = useCallback((data: any) => {
    setBiometricData(data);
  }, []);

  // Preference update handler
  const handlePreferenceUpdate = (preferences: any) => {
    setUserPreferences(preferences);
    console.log('Updated user preferences:', preferences);
  };

  // Memory editing handlers
  const handleEditMemory = (memory: any) => {
    setSelectedMemory(memory);
    setIsMemoryModalOpen(true);
  };

  const handleSaveMemory = (updatedMemory: any) => {
    setMemories(prev => prev.map(m => m.id === updatedMemory.id ? updatedMemory : m));
    setIsMemoryModalOpen(false);
    setSelectedMemory(null);
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId));
    setIsMemoryModalOpen(false);
    setSelectedMemory(null);
  };

  // Create floating ambient elements
  useEffect(() => {
    const createAmbientElement = () => {
      const elements = ['✨', '💫', '🌟', '💖', '🎈'];
      const element = document.createElement('div');
      element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
      element.className = 'floating fixed pointer-events-none z-20';
      element.style.left = Math.random() * window.innerWidth + 'px';
      element.style.top = window.innerHeight + 'px';
      element.style.fontSize = Math.random() * 20 + 15 + 'px';
      element.style.opacity = '0.7';
      
      // Animate upward
      element.style.animation = 'floatingUp 15s linear forwards';
      
      document.body.appendChild(element);
      
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 15000);
    };

    const interval = setInterval(createAmbientElement, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden theme-transition gpu-accelerated">
      {/* Emergency cursor now handled by CSS */}

      {/* The HeroSection now includes its own AkshitaDynamicBackground */}
      {/* Keep Enhanced3DEffects for other sections if needed */}
      <Enhanced3DEffects
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled}
        beatIntensity={beatIntensity}
        biometricData={biometricData}
      />

      {/* Original Particle System (Fallback) for non-hero sections */}
      <ParticleSystem
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled && !window.WebGLRenderingContext}
      />
      
      {/* Cursor Effects */}
      <CursorEffects
        theme={currentTheme}
        isActive={effectsEnabled}
      />
      
      {/* Revolutionary Floating Navigation */}
      <FloatingNavigation
        onNavigate={handleNavigation}
        currentSection={activeSection}
        mousePosition={mousePosition}
      />
      
      {/* AI Companion Chatbot */}
      <AICompanion
        theme={currentTheme}
        userName="Beautiful"
        isVoiceTriggered={isVoiceTriggeredChat}
        onVoiceCommand={handleVoiceCommand}
      />

      {/* Advanced Music System */}
      <MusicSystem
        theme={currentTheme}
        onMoodChange={handleMoodChange}
      />

      {/* Biometric Awareness */}
      <BiometricAwareness
        theme={currentTheme}
        onDataUpdate={handleBiometricUpdate}
      />

      {/* Voice Navigation */}
      <TargetCursor
        cursorText="Voice Commands"
        variant="voice-command"
      >
        <VoiceNavigation
          onNavigate={handleNavigation}
          onCommand={handleVoiceCommand}
          onChatOpen={handleVoiceChatOpen}
        />
      </TargetCursor>

      {/* Surprise Generator */}
      <SurpriseGenerator
        theme={currentTheme}
        biometricData={biometricData}
        userMood={currentMood}
      />
      
      {/* Theme Controller */}
      <ThemeController
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      
      {/* Effects Toggle */}
      <div className="fixed bottom-4 right-20 z-50">
        <button
          onClick={() => setEffectsEnabled(!effectsEnabled)}
          className={`glass-romantic rounded-full p-3 hover-lift transition-all ${
            effectsEnabled ? 'text-romantic' : 'text-muted-foreground'
          }`}
          title={effectsEnabled ? 'Disable Effects' : 'Enable Effects'}
        >
          ✨
        </button>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection
            theme={currentTheme}
            onNavigate={handleNavigation}
          />
        </div>

        {/* Memory Timeline */}
        <div id="timeline">
          <MemoryTimeline theme={currentTheme} />
        </div>

        {/* Personalization Engine */}
        <div id="personalization">
          <PersonalizationEngine
            theme={currentTheme}
            onPreferenceUpdate={handlePreferenceUpdate}
          />
        </div>

        {/* Our Beautiful Memories Section with ReactBits Lightning Background */}
        <div id="memories" className="min-h-screen relative" data-background="dark">
          {/* ReactBits Lightning Background */}
          <ReactBitsLightning 
            intensity="medium"
            isActive={true}
            className="lightning-background"
          />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-6xl font-romantic font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-4">
                  Our Beautiful Memories
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Every precious moment with AKSHITA, captured and preserved forever
                </p>
              </motion.div>

              {/* Memory Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {memories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 memory-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    data-interactive
                  >
                    {/* Enhanced Edit Me Button */}
                    <motion.button
                      onClick={() => handleEditMemory(memory)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 backdrop-blur-sm rounded-full p-3 transition-all duration-500 border border-cyan-400/30 hover:border-cyan-400/60"
                      whileHover={{ 
                        scale: 1.15, 
                        rotate: 10,
                        boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Edit className="w-4 h-4 text-cyan-300" />
                      
                      {/* Edit Me Tooltip */}
                      <motion.div
                        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-cyan-500/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Edit Me
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-cyan-500/90"></div>
                      </motion.div>
                      
                      {/* Electric glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-cyan-400/20"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0, 0.6, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.button>

                    {/* Memory Photos */}
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <img
                        src={memory.photos[0]}
                        alt={memory.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {memory.photos.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          +{memory.photos.length - 1}
                        </div>
                      )}
                    </div>

                    {/* Memory Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">{memory.title}</h3>
                      <p className="text-white/70 text-sm line-clamp-2">{memory.description}</p>
                      
                      <div className="flex items-center gap-4 text-white/60 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(memory.date).toLocaleDateString()}
                        </div>
                        {memory.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {memory.location}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {memory.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-cyan-400/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Heart Icon */}
                    <motion.div
                      className="absolute bottom-4 right-4 text-pink-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Add New Memory Button */}
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Create New Memory
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Our Romantic Songs Section with ReactBits Lightning Background */}
        <div id="music" className="min-h-screen relative" data-background="dark">
          {/* ReactBits Lightning Background */}
          <ReactBitsLightning 
            intensity="high"
            color="#ff6b9d"
            isActive={true}
            className="lightning-background"
          />
          
          <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Section Header */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl md:text-6xl font-romantic font-bold bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-300 bg-clip-text text-transparent mb-4">
                  Our Romantic Songs
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Every melody that reminds me of AKSHITA, every beat that makes my heart skip
                </p>
              </motion.div>

              {/* Music Player Mockup */}
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="text-6xl mb-6">🎵</div>
                <h3 className="text-2xl font-semibold text-white mb-4">AKSHITA's Playlist</h3>
                
                {/* Mock Song List */}
                <div className="space-y-3 mb-8">
                  {[
                    { title: "Perfect", artist: "Ed Sheeran", duration: "4:23" },
                    { title: "All of Me", artist: "John Legend", duration: "4:29" },
                    { title: "Thinking Out Loud", artist: "Ed Sheeran", duration: "4:41" }
                  ].map((song, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="text-left">
                        <div className="text-white font-medium">{song.title}</div>
                        <div className="text-white/60 text-sm">{song.artist}</div>
                      </div>
                      <div className="text-white/60 text-sm">{song.duration}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Spotify Integration Notice */}
                <motion.div
                  className="bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-400/30 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h4 className="text-green-300 font-semibold mb-2">🎶 Spotify Integration Coming Soon!</h4>
                  <p className="text-green-200/80 text-sm">
                    Connect your Spotify account to play our special songs together
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <div id="surprises" className="min-h-screen flex items-center justify-center">
          <div className="glass rounded-3xl p-12 text-center max-w-2xl mx-4">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-3xl font-romantic font-bold text-primary mb-4">
              Surprise Generator
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Weather-aware, time-sensitive surprises just for you. Love notes that appear at perfect moments.
            </p>
            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-primary">AI-powered surprises loading... ✨</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass-romantic p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-romantic font-romantic text-lg mb-4">
            Made with infinite love and cutting-edge technology 💖
          </p>
          <p className="text-muted-foreground text-sm">
            This website learns and grows more beautiful with every visit, just like our love.
          </p>
          <div className="mt-6 flex justify-center space-x-4 text-2xl">
            <span className="animate-pulse-romantic">💕</span>
            <span className="animate-float">✨</span>
            <span className="animate-pulse-romantic">💫</span>
            <span className="animate-float-delayed">🌟</span>
            <span className="animate-pulse-romantic">💖</span>
          </div>
        </div>
      </footer>

      {/* Memory Edit Modal */}
      <MemoryEditModal
        memory={selectedMemory}
        isOpen={isMemoryModalOpen}
        onClose={() => {
          setIsMemoryModalOpen(false);
          setSelectedMemory(null);
        }}
        onSave={handleSaveMemory}
        onDelete={handleDeleteMemory}
      />
    </div>
  );
};

export default Index;