import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ImprovedGalaxy } from '@/components/ImprovedGalaxy';
import { ImprovedLightning } from '@/components/ImprovedLightning';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<'morning' | 'evening' | 'night'>('morning');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [userPreferences, setUserPreferences] = useState({});
  const [currentMood, setCurrentMood] = useState('romantic');
  const [beatIntensity, setBeatIntensity] = useState(0);
  const [biometricData, setBiometricData] = useState({});
  const [isVoiceTriggeredChat, setIsVoiceTriggeredChat] = useState(false);

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

  // Enhanced navigation handler with React Router
  const handleNavigation = (section: string) => {
    // Map sections to routes
    const routeMap: { [key: string]: string } = {
      'memories': '/memories',
      'music': '/music', 
      'songs': '/music',
      'surprises': '/surprises',
      'timeline': '/timeline',
      'personalization': '/personalization',
      'gallery': '/gallery',
      'settings': '/settings'
    };
    
    const route = routeMap[section];
    if (route) {
      navigate(route);
    } else {
      // Fallback to scroll within page for sections that don't have dedicated routes
      setActiveSection(section);
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
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

  // Memory editing is now handled by MemoryTimeline component

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
      {/* Improved Galaxy Background - Layer 0 */}
      <ImprovedGalaxy
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled}
        className="z-0"
      />

      {/* Enhanced 3D Effects - Layer 1 */}
      <Enhanced3DEffects
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled}
        beatIntensity={beatIntensity}
        biometricData={biometricData}
      />

      {/* Particle System Fallback - Layer 2 */}
      <ParticleSystem
        theme={currentTheme}
        mousePosition={mousePosition}
        isActive={effectsEnabled && !window.WebGLRenderingContext}
      />
      
             {/* Cursor Effects - Layer 5 */}
      <CursorEffects
        theme={currentTheme}
        isActive={effectsEnabled}
      />
      
      {/* Improved Lightning - Layer 15 */}
      <ImprovedLightning
        intensity="medium"
        color="romantic"
        isActive={currentTheme === 'evening' || currentTheme === 'night'}
        className="z-15"
      />
      
      {/* Floating Navigation - Layer 40 */}
      <FloatingNavigation
        onNavigate={handleNavigation}
        currentSection={activeSection}
        mousePosition={mousePosition}
      />
      
      {/* AI Companion Chatbot - Layer 50 */}
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

        {/* Our Beautiful Memories Section is now handled by MemoryTimeline component */}

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

      {/* Memory editing is now handled by MemoryTimeline component */}
    </div>
  );
};

export default Index;